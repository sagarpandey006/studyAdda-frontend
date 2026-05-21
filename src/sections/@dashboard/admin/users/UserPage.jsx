import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Alert } from "@mui/lab";
import {
  Avatar,
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
  Tooltip,
} from "@mui/material";

import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import Label from '../../../../components/label';
import TableToolbar from '../../../../components/table-toolbar';
import FilterDrawer from '../../../../components/filter-drawer';

import UserTableHead from "./UserListHead";
import UserForm from "./UserForm";
import UserDialog from "./UserDialog";
import { applySortFilter, getComparator } from '../../../../utils/tableOperations';
import { exportToCSV } from '../../../../utils/exportData';
import { userApi } from '../../../../services/api';

// 

const TABLE_HEAD = [
  { id: "select", label: "", alignRight: false },
  { id: "photo", label: "Photo", alignRight: false },
  { id: "name", label: "Name", alignRight: false },

  { id: "scholarNumber", label: "Scholar No.", alignRight: false },
  { id: "enrollmentNumber", label: "Enrollment No.", alignRight: false },

  { id: "phone", label: "Phone", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "joinDate", label: "Join Date", alignRight: false },
  { id: "", label: "Actions", alignRight: false }
];

// 

const UserPage = () => {
  // Table state
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Data state
  const [user, setUser] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    isAdmin: false,
    photoUrl: "",

    scholarNumber: "",
    enrollmentNumber: "",
    rfidCard: "",
    course: "",
    branch: "",
    year: "",
    semester: "",
    section: "",
    address: "",
    admissionDate: "",

    status: "Active",
    blockReason: "",

    fineAmount: 0,
    unpaidFine: 0,

    maxBookLimit: 5,
    totalBooksIssued: 0,

    lostDamagedBooks: []
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    joinDate: 'all'
  });

  // Load data
  useEffect(() => {
    getAllUsers();
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = [...users];

    // Apply search
    if (searchQuery) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      );
    }

    // Apply filters
    if (filters.role !== 'all') {
      const isAdmin = filters.role === 'admin';
      result = result.filter(user => user.isAdmin === isAdmin);
    }

    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }

    if (filters.joinDate !== 'all') {
      const now = new Date();
      result = result.filter(user => {
        const joinDate = new Date(user.joinDate || user.createdAt);
        const daysDiff = (now - joinDate) / (1000 * 60 * 60 * 24);

        switch (filters.joinDate) {
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          case 'year':
            return daysDiff <= 365;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result = applySortFilter(result, getComparator(order, orderBy), '');
    setFilteredUsers(result);
  }, [searchQuery, filters, users, order, orderBy]);

  // API operations
  const getAllUsers = async () => {
    try {
      const response = await userApi.getAll();
      setUsers(response.usersList);
      setFilteredUsers(response.usersList);
      setIsTableLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
      setIsTableLoading(false);
    }
  };

  const addUser = async () => {
    try {
      // console.log("Checking for what is printing:", user);
      const finalUser = {
        ...user,
        password: "User@123"
      };
      // console.log("final user is:", finalUser);
      await userApi.add(finalUser);

      toast.success("User added successfully");
      handleCloseModal();
      getAllUsers();
      clearForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong, please try again");
    }
  };

  const updateUser = async () => {
    try {
      await userApi.update(selectedUserId, user);
      toast.success("User updated successfully");
      handleCloseModal();
      handleCloseMenu();
      getAllUsers();
      clearForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong, please try again");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userApi.delete(userId);
      toast.success("User deleted successfully");
      handleCloseDialog();
      handleCloseMenu();
      getAllUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong, please try again");
    }
  };

  const bulkDeleteUsers = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      try {
        await Promise.all(selectedUsers.map(id => userApi.delete(id)));
        toast.success(`${selectedUsers.length} users deleted successfully`);
        setSelectedUsers([]);
        getAllUsers();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete some users");
      }
    }
  };

  const getSelectedUserDetails = () => {
    const selectedUser = users.find((element) => element._id === selectedUserId);
    setUser(selectedUser);
  };

  const clearForm = () => {
    setUser({
      name: "",
      email: "",
      dob: "",
      phone: "",
      isAdmin: false,
      photoUrl: "",

      scholarNumber: "",
      enrollmentNumber: "",
      rfidCard: "",
      course: "",
      branch: "",
      year: "",
      semester: "",
      section: "",
      address: "",
      admissionDate: "",

      status: "Active",
      blockReason: "",

      fineAmount: 0,
      unpaidFine: 0,

      maxBookLimit: 5,
      totalBooksIssued: 0,

      lostDamagedBooks: []
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
      role: 'all',
      status: 'all',
      joinDate: 'all'
    });
    setSearchQuery('');
    toast.success('Filters reset');
  };

  const handleExport = () => {
    const columns = [
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'phone', headerName: 'Phone' },
      { field: 'isAdmin', headerName: 'Role' },
      { field: 'status', headerName: 'Status' },
      { field: 'joinDate', headerName: 'Join Date' },
      { field: 'dob', headerName: 'Date of Birth' }
    ];
    exportToCSV(filteredUsers, columns, 'users');
    toast.success('Users exported successfully');
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const displayedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setSelectedUsers(displayedUsers.map(user => user._id));
    } else {
      setSelectedUsers([]);
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
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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

  const displayedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Helmet>
        <title>User Management | Library System</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h3">
            User Management
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              clearForm();
              setIsUpdateForm(false);
              handleOpenModal();
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        </Stack>

        {isTableLoading ? (
          <Grid container justifyContent="center" sx={{ py: 10 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Card>
            <TableToolbar
              // numSelected={selectedUsers.length}
              filterValue={searchQuery}
              onFilterChange={handleSearchChange}
              onFilterOpen={() => setIsFilterOpen(true)}
              onExport={handleExport}
              onBulkDelete={bulkDeleteUsers}
              placeholder="Search users by name, email, phone..."
              showFilter
              showExport
            />

            {selectedUsers.length > 0 && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 3, pb: 2 }}
              >
                {/* LEFT */}
                <Chip
                  label={`${selectedUsers.length} selected`}
                  color="primary"
                  onDelete={() => setSelectedUsers([])}
                />

                {/* RIGHT */}
                <Tooltip title="Delete selected">
                  <IconButton onClick={bulkDeleteUsers} color="error">
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}


            <Stack direction="row" spacing={2} sx={{ px: 3, pb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} of {users.length} users
              </Typography>
            </Stack>

            <Scrollbar>
              {filteredUsers.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserTableHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={displayedUsers.length}
                      numSelected={selectedUsers.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAll}
                    />
                    <TableBody>
                      {displayedUsers.map((user) => (
                        <TableRow
                          hover
                          key={user._id}
                          tabIndex={-1}
                          selected={selectedUsers.includes(user._id)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleSelectUser(user._id)}
                            />
                          </TableCell>

                          <TableCell align="left">
                            <Avatar alt={user.name} src={user.photoUrl} />
                          </TableCell>

                          <TableCell align="left">
                            <Stack spacing={0.5}>
                              <Typography variant="subtitle2">
                                {user.name}
                              </Typography>

                              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {user.email}
                              </Typography>
                            </Stack>
                          </TableCell>

                          {/* <TableCell align="left">{user.email}</TableCell> */}

                          <TableCell align="left">
                            {user.scholarNumber || "N/A"}
                          </TableCell>

                          <TableCell align="left">
                            {user.enrollmentNumber || "N/A"}
                          </TableCell>

                          <TableCell align="left">{user.phone || 'N/A'}</TableCell>

                          <TableCell align="left">
                            {user.isAdmin ? (
                              <Label color="warning">Librarian</Label>
                            ) : (
                              <Label color="success">Member</Label>
                            )}
                          </TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                user.status === 'Active'
                                  ? 'success'
                                  : user.status === 'Blocked'
                                    ? 'error'
                                    : 'warning'
                              }
                            >
                              {user.status}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            {new Date(user.joinDate || user.createdAt).toLocaleDateString("en-US")}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(e) => {
                                setSelectedUserId(user._id);
                                handleOpenMenu(e);
                              }}
                            >
                              <Iconify icon={"eva:more-vertical-fill"} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info" sx={{ m: 3 }}>
                  {searchQuery || Object.values(filters).some(f => f !== 'all')
                    ? 'No users found matching your search criteria. Try adjusting your filters.'
                    : 'No users found. Add your first user to get started!'}
                </Alert>
              )}
            </Scrollbar>

            {filteredUsers.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredUsers.length}
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
        title="Filter Users"
      >
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role}
              label="Role"
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Librarian</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active Only</MenuItem>
              <MenuItem value="inactive">Inactive Only</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Join Date</InputLabel>
            <Select
              value={filters.joinDate}
              label="Join Date"
              onChange={(e) => handleFilterChange('joinDate', e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </FilterDrawer>

      {/* Context Menu */}
      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75
            }
          }
        }}
      >
        <MenuItem
          onClick={() => {
            setIsUpdateForm(true);
            getSelectedUserDetails();
            handleCloseMenu();
            handleOpenModal();
          }}
        >
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }} onClick={handleOpenDialog}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      {/* Forms and Dialogs */}
      <UserForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        id={selectedUserId}
        user={user}
        setUser={setUser}
        handleAddUser={addUser}
        handleUpdateUser={updateUser}
      />

      <UserDialog
        isDialogOpen={isDialogOpen}
        userId={selectedUserId}
        handleDeleteUser={deleteUser}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};

export default UserPage;
