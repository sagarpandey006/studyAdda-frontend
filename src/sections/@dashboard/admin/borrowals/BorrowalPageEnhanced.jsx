import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Alert } from "@mui/lab";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  TextField
} from "@mui/material";
import { useAuth } from '../../../../hooks/useAuth';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import TableToolbar from '../../../../components/table-toolbar';
import FilterDrawer from '../../../../components/filter-drawer';

import BorrowalListHead from "./BorrowalListHead";
import BorrowalForm from "./BorrowalForm";
import BorrowalsDialog from "./BorrowalDialog";
import { applySortFilter, getComparator } from '../../../../utils/tableOperations';
import { exportToCSV } from '../../../../utils/exportData';
import MockDataService from '../../../../utils/mockDataService';

// 

const TABLE_HEAD = [
  { id: "select", label: "", alignRight: false },
  { id: "memberName", label: "Member Name", alignRight: false },
  { id: "bookName", label: "Book Name", alignRight: false },
  { id: "borrowedDate", label: "Borrowed On", alignRight: false },
  { id: "dueDate", label: "Due On", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "overdueStatus", label: "Overdue", alignRight: false },
  { id: "", label: "Actions", alignRight: true }
];

// 

const BorrowalPageEnhanced = () => {
  const { user } = useAuth();
  
  // Table state
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('borrowedDate');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Data state
  const [borrowal, setBorrowal] = useState({
    bookId: "",
    memberId: "",
    borrowedDate: "",
    dueDate: "",
    status: ""
  });
  const [borrowals, setBorrowals] = useState([]);
  const [filteredBorrowals, setFilteredBorrowals] = useState([]);
  const [selectedBorrowals, setSelectedBorrowals] = useState([]);
  const [selectedBorrowalId, setSelectedBorrowalId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    overdueOnly: false,
    dateRange: 'all'
  });

  // Load data
  useEffect(() => {
    getAllBorrowals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = [...borrowals];

    // Apply search
    if (searchQuery) {
      result = result.filter(borrowal =>
        borrowal.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrowal.book?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrowal.book?.isbn?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status !== 'all') {
      result = result.filter(b => b.status === filters.status);
    }

    if (filters.overdueOnly) {
      result = result.filter(b => 
        new Date(b.dueDate) < new Date() && b.status === 'issued'
      );
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter(b => {
        const borrowDate = new Date(b.issueDate);
        const daysDiff = (now - borrowDate) / (1000 * 60 * 60 * 24);
        
        switch (filters.dateRange) {
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          case 'threeMonths':
            return daysDiff <= 90;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result = applySortFilter(result, getComparator(order, orderBy), '');
    setFilteredBorrowals(result);
  }, [searchQuery, filters, borrowals, order, orderBy]);

  // API operations
  const getAllBorrowals = async () => {
    try {
      let response;
      if (user.isAdmin) {
        response = await MockDataService.getAllBorrowals();
        setBorrowals(response.borrowalsList);
      } else {
        response = await MockDataService.getUserBorrowals(user._id);
        setBorrowals(response.borrowalsList);
      }
      console.log(response);
      setIsTableLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load borrowals");
      setIsTableLoading(false);
    }
  };

  const addBorrowal = async () => {
    try {
      const response = await MockDataService.issueBorrow({
        bookId: borrowal.bookId,
        userId: borrowal.memberId
      });
      toast.success("Book issued successfully");
      console.log(response);
      handleCloseModal();
      getAllBorrowals();
      clearForm();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong, please try again");
    }
  };

  const returnBook = async () => {
    try {
      const response = await MockDataService.returnBorrowal(selectedBorrowalId);
      toast.success("Book returned successfully");
      handleCloseDialog();
      handleCloseMenu();
      console.log(response);
      getAllBorrowals();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again");
    }
  };

  const bulkReturnBooks = async () => {
    if (window.confirm(`Are you sure you want to return ${selectedBorrowals.length} books?`)) {
      try {
        await Promise.all(selectedBorrowals.map(id => MockDataService.returnBorrowal(id)));
        toast.success(`${selectedBorrowals.length} books returned successfully`);
        setSelectedBorrowals([]);
        getAllBorrowals();
      } catch (error) {
        console.error(error);
        toast.error("Failed to return some books");
      }
    }
  };

  const clearForm = () => {
    setBorrowal({
      bookId: "",
      memberId: "",
      borrowedDate: "",
      dueDate: "",
      status: ""
    });
  };

  // Handler functions
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    toast.success('Filters applied');
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      overdueOnly: false,
      dateRange: 'all'
    });
    setSearchQuery('');
    toast.success('Filters reset');
  };

  const handleExport = () => {
    const columns = [
      { field: 'user.name', headerName: 'Member Name' },
      { field: 'book.name', headerName: 'Book Name' },
      { field: 'book.isbn', headerName: 'ISBN' },
      { field: 'issueDate', headerName: 'Issue Date' },
      { field: 'dueDate', headerName: 'Due Date' },
      { field: 'returnDate', headerName: 'Return Date' },
      { field: 'status', headerName: 'Status' }
    ];
    exportToCSV(filteredBorrowals, columns, 'borrowals');
    toast.success('Borrowals exported successfully');
  };

  const handleSelectBorrowal = (borrowalId) => {
    setSelectedBorrowals(prev =>
      prev.includes(borrowalId)
        ? prev.filter(id => id !== borrowalId)
        : [...prev, borrowalId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const displayedBorrowals = filteredBorrowals.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setSelectedBorrowals(displayedBorrowals.map(b => b._id));
    } else {
      setSelectedBorrowals([]);
    }
  };

  const handleOpenMenu = (event) => {
    setIsMenuOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const displayedBorrowals = filteredBorrowals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate statistics
  const stats = {
    total: borrowals.length,
    issued: borrowals.filter(b => b.status === 'issued').length,
    returned: borrowals.filter(b => b.status === 'returned').length,
    overdue: borrowals.filter(b => new Date(b.dueDate) < new Date() && b.status === 'issued').length
  };

  return (
    <>
      <Helmet>
        <title>Borrowal Management | Library System</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h3">
            Borrowal Management
          </Typography>
          {user.isAdmin && (
            <Button
              variant="contained"
              onClick={() => {
                setIsUpdateForm(false);
                handleOpenModal();
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Issue New Book
            </Button>
          )}
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Borrowals</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">{stats.issued}</Typography>
              <Typography variant="body2" color="text.secondary">Currently Issued</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">{stats.returned}</Typography>
              <Typography variant="body2" color="text.secondary">Returned</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="error.main">{stats.overdue}</Typography>
              <Typography variant="body2" color="text.secondary">Overdue</Typography>
            </Card>
          </Grid>
        </Grid>

        {isTableLoading ? (
          <Grid container justifyContent="center" sx={{ py: 10 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Card>
            <TableToolbar
              numSelected={selectedBorrowals.length}
              filterValue={searchQuery}
              onFilterChange={handleSearchChange}
              onFilterOpen={() => setIsFilterOpen(true)}
              onExport={handleExport}
              onBulkDelete={bulkReturnBooks}
              placeholder="Search borrowals by member, book, ISBN..."
              showFilter
              showExport
            />

            {selectedBorrowals.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ px: 3, pb: 2 }}>
                <Chip
                  label={`${selectedBorrowals.length} selected`}
                  color="primary"
                  onDelete={() => setSelectedBorrowals([])}
                />
              </Stack>
            )}

            <Stack direction="row" spacing={2} sx={{ px: 3, pb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredBorrowals.length} of {borrowals.length} borrowals
              </Typography>
            </Stack>

            <Scrollbar>
              {filteredBorrowals.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <BorrowalListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={displayedBorrowals.length}
                      numSelected={selectedBorrowals.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAll}
                    />
                    <TableBody>
                      {displayedBorrowals.map((borrowal) => {
                        const isOverdue = new Date(borrowal.dueDate) < new Date() && borrowal.status === 'issued';
                        
                        return (
                          <TableRow
                            hover
                            key={borrowal._id}
                            tabIndex={-1}
                            selected={selectedBorrowals.includes(borrowal._id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedBorrowals.includes(borrowal._id)}
                                onChange={() => handleSelectBorrowal(borrowal._id)}
                              />
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="subtitle2">
                                {borrowal.user?.name}
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="body2">
                                {borrowal.book?.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ISBN: {borrowal.book?.isbn}
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              {new Date(borrowal.issueDate).toLocaleDateString("en-US")}
                            </TableCell>

                            <TableCell align="left">
                              {new Date(borrowal.dueDate).toLocaleDateString("en-US")}
                            </TableCell>

                            <TableCell align="left">
                              <Label color={borrowal.status === 'issued' ? 'warning' : 'success'}>
                                {borrowal.status}
                              </Label>
                            </TableCell>

                            <TableCell align="left">
                              {isOverdue && (
                                <Label color="error">
                                  Overdue
                                </Label>
                              )}
                            </TableCell>

                            <TableCell align="right">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={(e) => {
                                  setSelectedBorrowalId(borrowal._id);
                                  handleOpenMenu(e);
                                }}
                              >
                                <Iconify icon={'eva:more-vertical-fill'} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info" sx={{ m: 3 }}>
                  {searchQuery || Object.values(filters).some(f => f !== 'all' && f !== false)
                    ? 'No borrowals found matching your search criteria. Try adjusting your filters.'
                    : 'No borrowals found.'}
                </Alert>
              )}
            </Scrollbar>

            {filteredBorrowals.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredBorrowals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Card>
        )}
      </Container>

      {/* Filter Drawer */}
      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        title="Filter Borrowals"
      >
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="issued">Issued Only</MenuItem>
              <MenuItem value="returned">Returned Only</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={filters.dateRange}
              label="Date Range"
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="threeMonths">Last 3 Months</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Show Overdue Only</Typography>
              <Checkbox
                checked={filters.overdueOnly}
                onChange={(e) => handleFilterChange('overdueOnly', e.target.checked)}
              />
            </Stack>
          </FormControl>
        </Stack>
      </FilterDrawer>

      {/* Context Menu */}
      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenDialog}>
          <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ mr: 2 }} />
          Return Book
        </MenuItem>
      </Popover>

      {/* Forms and Dialogs */}
      <BorrowalForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        id={selectedBorrowalId}
        borrowal={borrowal}
        setBorrowal={setBorrowal}
        handleAddBorrowal={addBorrowal}
        handleUpdateBorrowal={() => {}}
      />

      <BorrowalsDialog
        isDialogOpen={isDialogOpen}
        borrowalsId={selectedBorrowalId}
        handleDeleteBorrowal={returnBook}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};

export default BorrowalPageEnhanced;
