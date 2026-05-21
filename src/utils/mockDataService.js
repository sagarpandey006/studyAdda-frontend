// Mock Data Service for StudyAdda Library Management System
// This service provides mock data for all non-authentication operations

import { generateMockSeats, generateMockStatistics } from './mockSeatData';

// Mock Users Data
const mockUsers = [
  {
    _id: 'user1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.admin@studyadda.com',
    phone: '9876543210',
    dob: '1980-05-15',
    isAdmin: true,
    photoUrl: 'https://avatars.dicebear.com/api/male/Dr.+Rajesh+Kumar.svg',
    password: 'admin123',
    status: 'active',
    joinDate: '2020-01-15',
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user2',
    name: 'Priya Sharma',
    email: 'priya.librarian@studyadda.com',
    phone: '9876543211',
    dob: '1985-08-22',
    isAdmin: true,
    photoUrl: 'https://avatars.dicebear.com/api/female/Priya+Sharma.svg',
    password: 'librarian123',
    status: 'active',
    joinDate: '2021-03-10',
    createdAt: new Date('2021-03-10'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user3',
    name: 'Amit Patel',
    email: 'amit.student@studyadda.com',
    phone: '9876543212',
    dob: '2000-12-10',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/male/Amit+Patel.svg',
    password: 'student123',
    status: 'active',
    joinDate: '2023-09-01',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user4',
    name: 'Sneha Reddy',
    email: 'sneha.member@studyadda.com',
    phone: '9876543213',
    dob: '1999-03-25',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/female/Sneha+Reddy.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2023-08-15',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user5',
    name: 'Vikram Singh',
    email: 'vikram.student@studyadda.com',
    phone: '9876543214',
    dob: '2001-07-18',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/male/Vikram+Singh.svg',
    password: 'student456',
    status: 'active',
    joinDate: '2023-09-01',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-11-30')
  },
  // Additional Member Users
  {
    _id: 'user6',
    name: 'Ananya Iyer',
    email: 'ananya.member@studyadda.com',
    phone: '9876543215',
    dob: '2001-05-20',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/female/Ananya+Iyer.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2024-01-10',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user7',
    name: 'Rohan Gupta',
    email: 'rohan.member@studyadda.com',
    phone: '9876543216',
    dob: '2000-08-14',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/male/Rohan+Gupta.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2024-02-05',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user8',
    name: 'Kavya Nair',
    email: 'kavya.member@studyadda.com',
    phone: '9876543217',
    dob: '1999-11-30',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/female/Kavya+Nair.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2023-11-20',
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user9',
    name: 'Aditya Sharma',
    email: 'aditya.member@studyadda.com',
    phone: '9876543218',
    dob: '2001-02-18',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/male/Aditya+Sharma.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2024-03-15',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user10',
    name: 'Ishita Bansal',
    email: 'ishita.member@studyadda.com',
    phone: '9876543219',
    dob: '2000-06-22',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/female/Ishita+Bansal.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2024-01-25',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user11',
    name: 'Karthik Reddy',
    email: 'karthik.member@studyadda.com',
    phone: '9876543220',
    dob: '1999-09-10',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/male/Karthik+Reddy.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2023-12-01',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'user12',
    name: 'Meera Desai',
    email: 'meera.member@studyadda.com',
    phone: '9876543221',
    dob: '2001-03-08',
    isAdmin: false,
    photoUrl: 'https://avatars.dicebear.com/api/female/Meera+Desai.svg',
    password: 'member123',
    status: 'active',
    joinDate: '2024-04-12',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-11-30')
  }
];

// Mock Authors Data
const mockAuthors = [
  { _id: 'author1', name: 'Robert C. Martin', bio: 'Software engineer and author', country: 'USA' },
  { _id: 'author2', name: 'Bjarne Stroustrup', bio: 'Creator of C++', country: 'Denmark' },
  { _id: 'author3', name: 'Donald Knuth', bio: 'Computer scientist and mathematician', country: 'USA' },
  { _id: 'author4', name: 'Gang of Four', bio: 'Design Patterns authors', country: 'Various' },
  { _id: 'author5', name: 'Martin Fowler', bio: 'Software engineer and author', country: 'UK' },
  { _id: 'author6', name: 'J.K. Rowling', bio: 'British author', country: 'UK' },
  { _id: 'author7', name: 'George Orwell', bio: 'English novelist', country: 'UK' },
  { _id: 'author8', name: 'Harper Lee', bio: 'American novelist', country: 'USA' },
  { _id: 'author9', name: 'Eric Gamma', bio: 'Software engineer and design patterns expert', country: 'Switzerland' },
  { _id: 'author10', name: 'Joshua Bloch', bio: 'Java architect and author', country: 'USA' },
  { _id: 'author11', name: 'Erich Gamma', bio: 'Computer scientist', country: 'Switzerland' },
  { _id: 'author12', name: 'Kent Beck', bio: 'Software engineer and TDD pioneer', country: 'USA' },
  { _id: 'author13', name: 'Andrew Hunt', bio: 'The Pragmatic Programmer co-author', country: 'USA' },
  { _id: 'author14', name: 'David Thomas', bio: 'The Pragmatic Programmer co-author', country: 'USA' },
  { _id: 'author15', name: 'Frederick P. Brooks', bio: 'Computer scientist and author', country: 'USA' },
  { _id: 'author16', name: 'Steve McConnell', bio: 'Software engineering author', country: 'USA' },
  { _id: 'author17', name: 'Thomas H. Cormen', bio: 'Algorithms author', country: 'USA' },
  { _id: 'author18', name: 'Douglas Crockford', bio: 'JavaScript expert', country: 'USA' },
  { _id: 'author19', name: 'Kyle Simpson', bio: 'JavaScript expert and author', country: 'USA' },
  { _id: 'author20', name: 'Dan Brown', bio: 'Thriller novelist', country: 'USA' },
  { _id: 'author21', name: 'Agatha Christie', bio: 'Mystery writer', country: 'UK' },
  { _id: 'author22', name: 'Isaac Newton', bio: 'Physicist and Mathematician', country: 'UK' },
  { _id: 'author23', name: 'Stephen Hawking', bio: 'Theoretical Physicist', country: 'UK' },
  { _id: 'author24', name: 'Carl Sagan', bio: 'Astronomer and Science Communicator', country: 'USA' },
  { _id: 'author25', name: 'Richard Feynman', bio: 'Theoretical Physicist', country: 'USA' }
];

// Mock Genres Data
const mockGenres = [
  { _id: 'genre1', name: 'Computer Science', description: 'Books related to computer science and programming' },
  { _id: 'genre2', name: 'Engineering', description: 'Engineering and technical books' },
  { _id: 'genre3', name: 'Mathematics', description: 'Mathematics and statistics' },
  { _id: 'genre4', name: 'Literature', description: 'Fiction and literature' },
  { _id: 'genre5', name: 'Science', description: 'General science books' },
  { _id: 'genre6', name: 'Business', description: 'Business and management' },
  { _id: 'genre7', name: 'Programming', description: 'Programming languages and techniques' },
  { _id: 'genre8', name: 'Web Development', description: 'Web design and development' },
  { _id: 'genre9', name: 'Data Science', description: 'Data analysis and machine learning' },
  { _id: 'genre10', name: 'Physics', description: 'Physics and quantum mechanics' },
  { _id: 'genre11', name: 'Mystery', description: 'Mystery and thriller novels' },
  { _id: 'genre12', name: 'Self-Help', description: 'Personal development and motivation' }
];

// Mock Books Data
const mockBooks = [
  {
    _id: 'book1',
    name: 'Clean Code',
    isbn: '978-0132350884',
    summary: 'A Handbook of Agile Software Craftsmanship',
    isAvailable: true,
    authorId: 'author1',
    author: mockAuthors.find(a => a._id === 'author1'),
    genreId: 'genre1',
    genre: mockGenres.find(g => g._id === 'genre1'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    rfidTag: 'RFID001',
    totalCopies: 5,
    availableCopies: 3,
    publishYear: '2008',
    location: 'A-001',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book2',
    name: 'The C++ Programming Language',
    isbn: '978-0321563842',
    summary: 'Complete reference to C++ programming language',
    isAvailable: true,
    authorId: 'author2',
    author: mockAuthors.find(a => a._id === 'author2'),
    genreId: 'genre1',
    genre: mockGenres.find(g => g._id === 'genre1'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51D36pLo5YL._SX394_BO1,204,203,200_.jpg',
    rfidTag: 'RFID002',
    totalCopies: 3,
    availableCopies: 2,
    publishYear: '2013',
    location: 'A-002',
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book3',
    name: 'Design Patterns',
    isbn: '978-0201633612',
    summary: 'Elements of Reusable Object-Oriented Software',
    isAvailable: false,
    authorId: 'author4',
    author: mockAuthors.find(a => a._id === 'author4'),
    genreId: 'genre1',
    genre: mockGenres.find(g => g._id === 'genre1'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg',
    rfidTag: 'RFID003',
    totalCopies: 4,
    availableCopies: 0,
    publishYear: '1994',
    location: 'A-003',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book4',
    name: 'Harry Potter and the Philosopher\'s Stone',
    isbn: '978-0747532699',
    summary: 'The first book in the Harry Potter series',
    isAvailable: true,
    authorId: 'author6',
    author: mockAuthors.find(a => a._id === 'author6'),
    genreId: 'genre4',
    genre: mockGenres.find(g => g._id === 'genre4'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51HSkTKlauL._SX346_BO1,204,203,200_.jpg',
    rfidTag: 'RFID004',
    totalCopies: 10,
    availableCopies: 7,
    publishYear: '1997',
    location: 'L-001',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book5',
    name: '1984',
    isbn: '978-0452284234',
    summary: 'Dystopian social science fiction novel',
    isAvailable: true,
    authorId: 'author7',
    author: mockAuthors.find(a => a._id === 'author7'),
    genreId: 'genre4',
    genre: mockGenres.find(g => g._id === 'genre4'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41E8R2K5ExL._SX324_BO1,204,203,200_.jpg',
    rfidTag: 'RFID005',
    totalCopies: 6,
    availableCopies: 4,
    publishYear: '1949',
    location: 'L-002',
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2024-11-30')
  },
  // Additional Books for Members
  {
    _id: 'book6',
    name: 'Effective Java',
    isbn: '978-0134685991',
    summary: 'Best practices for Java programming',
    isAvailable: true,
    authorId: 'author10',
    author: mockAuthors.find(a => a._id === 'author10'),
    genreId: 'genre7',
    genre: mockGenres.find(g => g._id === 'genre7'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41pSi1MhcfL._SX376_BO1,204,203,200_.jpg',
    rfidTag: 'RFID006',
    totalCopies: 6,
    availableCopies: 4,
    publishYear: '2017',
    location: 'A-006',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book7',
    name: 'The Pragmatic Programmer',
    isbn: '978-0135957059',
    summary: 'Your Journey to Mastery',
    isAvailable: true,
    authorId: 'author13',
    author: mockAuthors.find(a => a._id === 'author13'),
    genreId: 'genre7',
    genre: mockGenres.find(g => g._id === 'genre7'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX331_BO1,204,203,200_.jpg',
    rfidTag: 'RFID007',
    totalCopies: 8,
    availableCopies: 5,
    publishYear: '2019',
    location: 'A-007',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book8',
    name: 'The Mythical Man-Month',
    isbn: '978-0201835953',
    summary: 'Essays on Software Engineering',
    isAvailable: true,
    authorId: 'author15',
    author: mockAuthors.find(a => a._id === 'author15'),
    genreId: 'genre2',
    genre: mockGenres.find(g => g._id === 'genre2'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51XnDL5KC%2BL._SX334_BO1,204,203,200_.jpg',
    rfidTag: 'RFID008',
    totalCopies: 5,
    availableCopies: 3,
    publishYear: '1995',
    location: 'A-008',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book9',
    name: 'Code Complete',
    isbn: '978-0735619678',
    summary: 'A Practical Handbook of Software Construction',
    isAvailable: true,
    authorId: 'author16',
    author: mockAuthors.find(a => a._id === 'author16'),
    genreId: 'genre7',
    genre: mockGenres.find(g => g._id === 'genre7'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51FUYfErPcL._SX408_BO1,204,203,200_.jpg',
    rfidTag: 'RFID009',
    totalCopies: 7,
    availableCopies: 6,
    publishYear: '2004',
    location: 'A-009',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book10',
    name: 'Introduction to Algorithms',
    isbn: '978-0262033848',
    summary: 'Comprehensive guide to algorithms',
    isAvailable: true,
    authorId: 'author17',
    author: mockAuthors.find(a => a._id === 'author17'),
    genreId: 'genre1',
    genre: mockGenres.find(g => g._id === 'genre1'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41T0iBxY8FL._SX440_BO1,204,203,200_.jpg',
    rfidTag: 'RFID010',
    totalCopies: 10,
    availableCopies: 8,
    publishYear: '2009',
    location: 'A-010',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book11',
    // eslint-disable-next-line no-script-url
    name: 'JavaScript: The Good Parts',
    isbn: '978-0596517748',
    summary: 'Unearthing the Excellence in JavaScript',
    isAvailable: true,
    authorId: 'author18',
    author: mockAuthors.find(a => a._id === 'author18'),
    genreId: 'genre8',
    genre: mockGenres.find(g => g._id === 'genre8'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/5166ztViuNL._SX381_BO1,204,203,200_.jpg',
    rfidTag: 'RFID011',
    totalCopies: 6,
    availableCopies: 3,
    publishYear: '2008',
    location: 'W-001',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book12',
    name: 'You Don\'t Know JS',
    isbn: '978-1491904244',
    summary: 'Deep dive into JavaScript mechanics',
    isAvailable: true,
    authorId: 'author19',
    author: mockAuthors.find(a => a._id === 'author19'),
    genreId: 'genre8',
    genre: mockGenres.find(g => g._id === 'genre8'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41jySchwc2L._SX331_BO1,204,203,200_.jpg',
    rfidTag: 'RFID012',
    totalCopies: 8,
    availableCopies: 6,
    publishYear: '2015',
    location: 'W-002',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book13',
    name: 'The Da Vinci Code',
    isbn: '978-0307474278',
    summary: 'A mystery thriller novel',
    isAvailable: true,
    authorId: 'author20',
    author: mockAuthors.find(a => a._id === 'author20'),
    genreId: 'genre11',
    genre: mockGenres.find(g => g._id === 'genre11'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51WrDbb2ekL._SX324_BO1,204,203,200_.jpg',
    rfidTag: 'RFID013',
    totalCopies: 12,
    availableCopies: 10,
    publishYear: '2003',
    location: 'L-003',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book14',
    name: 'Murder on the Orient Express',
    isbn: '978-0062693662',
    summary: 'Classic mystery by Agatha Christie',
    isAvailable: true,
    authorId: 'author21',
    author: mockAuthors.find(a => a._id === 'author21'),
    genreId: 'genre11',
    genre: mockGenres.find(g => g._id === 'genre11'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51aJlKwzbgL._SX324_BO1,204,203,200_.jpg',
    rfidTag: 'RFID014',
    totalCopies: 8,
    availableCopies: 7,
    publishYear: '1934',
    location: 'L-004',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book15',
    name: 'To Kill a Mockingbird',
    isbn: '978-0061120084',
    summary: 'American classic novel',
    isAvailable: true,
    authorId: 'author8',
    author: mockAuthors.find(a => a._id === 'author8'),
    genreId: 'genre4',
    genre: mockGenres.find(g => g._id === 'genre4'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51IXWZzlgSL._SX330_BO1,204,203,200_.jpg',
    rfidTag: 'RFID015',
    totalCopies: 9,
    availableCopies: 8,
    publishYear: '1960',
    location: 'L-005',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book16',
    name: 'A Brief History of Time',
    isbn: '978-0553380163',
    summary: 'From Big Bang to Black Holes',
    isAvailable: true,
    authorId: 'author23',
    author: mockAuthors.find(a => a._id === 'author23'),
    genreId: 'genre10',
    genre: mockGenres.find(g => g._id === 'genre10'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51D4ElZNr4L._SX323_BO1,204,203,200_.jpg',
    rfidTag: 'RFID016',
    totalCopies: 7,
    availableCopies: 5,
    publishYear: '1988',
    location: 'S-001',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book17',
    name: 'Cosmos',
    isbn: '978-0345539434',
    summary: 'Journey through space and time',
    isAvailable: true,
    authorId: 'author24',
    author: mockAuthors.find(a => a._id === 'author24'),
    genreId: 'genre5',
    genre: mockGenres.find(g => g._id === 'genre5'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51fJyk5tqsL._SX331_BO1,204,203,200_.jpg',
    rfidTag: 'RFID017',
    totalCopies: 6,
    availableCopies: 4,
    publishYear: '1980',
    location: 'S-002',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book18',
    name: 'Refactoring',
    isbn: '978-0134757599',
    summary: 'Improving the Design of Existing Code',
    isAvailable: true,
    authorId: 'author5',
    author: mockAuthors.find(a => a._id === 'author5'),
    genreId: 'genre7',
    genre: mockGenres.find(g => g._id === 'genre7'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41LBzpPXCOL._SX379_BO1,204,203,200_.jpg',
    rfidTag: 'RFID018',
    totalCopies: 5,
    availableCopies: 3,
    publishYear: '2018',
    location: 'A-018',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book19',
    name: 'The Art of Computer Programming Vol 1',
    isbn: '978-0201896831',
    summary: 'Fundamental Algorithms',
    isAvailable: true,
    authorId: 'author3',
    author: mockAuthors.find(a => a._id === 'author3'),
    genreId: 'genre1',
    genre: mockGenres.find(g => g._id === 'genre1'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41aG7v9yxBL._SX379_BO1,204,203,200_.jpg',
    rfidTag: 'RFID019',
    totalCopies: 4,
    availableCopies: 2,
    publishYear: '1997',
    location: 'A-019',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book20',
    name: 'Cracking the Coding Interview',
    isbn: '978-0984782857',
    summary: '189 Programming Questions and Solutions',
    isAvailable: true,
    authorId: 'author12',
    author: mockAuthors.find(a => a._id === 'author12'),
    genreId: 'genre7',
    genre: mockGenres.find(g => g._id === 'genre7'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41oYsXjLvZL._SX348_BO1,204,203,200_.jpg',
    rfidTag: 'RFID020',
    totalCopies: 15,
    availableCopies: 12,
    publishYear: '2015',
    location: 'A-020',
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book21',
    name: 'Harry Potter and the Chamber of Secrets',
    isbn: '978-0439064873',
    summary: 'The second book in the Harry Potter series',
    isAvailable: true,
    authorId: 'author6',
    author: mockAuthors.find(a => a._id === 'author6'),
    genreId: 'genre4',
    genre: mockGenres.find(g => g._id === 'genre4'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51jNORv6nQL._SX340_BO1,204,203,200_.jpg',
    rfidTag: 'RFID021',
    totalCopies: 10,
    availableCopies: 8,
    publishYear: '1998',
    location: 'L-006',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book22',
    name: 'Animal Farm',
    isbn: '978-0451526342',
    summary: 'A political allegory',
    isAvailable: true,
    authorId: 'author7',
    author: mockAuthors.find(a => a._id === 'author7'),
    genreId: 'genre4',
    genre: mockGenres.find(g => g._id === 'genre4'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51QC8BnqGdL._SX326_BO1,204,203,200_.jpg',
    rfidTag: 'RFID022',
    totalCopies: 7,
    availableCopies: 5,
    publishYear: '1945',
    location: 'L-007',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book23',
    name: 'Surely You\'re Joking, Mr. Feynman!',
    isbn: '978-0393316049',
    summary: 'Adventures of a Curious Character',
    isAvailable: true,
    authorId: 'author25',
    author: mockAuthors.find(a => a._id === 'author25'),
    genreId: 'genre5',
    genre: mockGenres.find(g => g._id === 'genre5'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41gqLAVkCiL._SX322_BO1,204,203,200_.jpg',
    rfidTag: 'RFID023',
    totalCopies: 5,
    availableCopies: 4,
    publishYear: '1985',
    location: 'S-003',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book24',
    name: 'Head First Design Patterns',
    isbn: '978-0596007126',
    summary: 'A Brain-Friendly Guide',
    isAvailable: false,
    authorId: 'author9',
    author: mockAuthors.find(a => a._id === 'author9'),
    genreId: 'genre7',
    genre: mockGenres.find(g => g._id === 'genre7'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/51VGvz%2B7P6L._SX430_BO1,204,203,200_.jpg',
    rfidTag: 'RFID024',
    totalCopies: 8,
    availableCopies: 0,
    publishYear: '2004',
    location: 'A-024',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'book25',
    name: 'Test Driven Development: By Example',
    isbn: '978-0321146533',
    summary: 'Learn TDD with practical examples',
    isAvailable: true,
    authorId: 'author12',
    author: mockAuthors.find(a => a._id === 'author12'),
    genreId: 'genre7',
    genre: mockGenres.find(g => g._id === 'genre7'),
    photoUrl: 'https://images-na.ssl-images-amazon.com/images/I/41dnWMXkA-L._SX396_BO1,204,203,200_.jpg',
    rfidTag: 'RFID025',
    totalCopies: 6,
    availableCopies: 5,
    publishYear: '2002',
    location: 'A-025',
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-11-30')
  }
];

// Mock Borrowals Data
const mockBorrowals = [
  {
    _id: 'borrowal1',
    bookId: 'book1',
    book: mockBooks.find(b => b._id === 'book1'),
    userId: '68efec752019d1acff21c1a5',
    user: mockUsers.find(u => u._id === 'user3'),
    issueDate: new Date('2026-02-10'),
    dueDate: new Date('2026-02-09'),
    returnDate: null,
    status: 'issued',
    fine: 200,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-10')
  },
  {
    _id: 'borrowal2',
    bookId: 'book3',
    book: mockBooks.find(b => b._id === 'book3'),
    userId: 'user4',
    user: mockUsers.find(u => u._id === 'user4'),
    issueDate: new Date('2026-02-05'),
    dueDate: new Date('2026-03-05'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 1,
    maxRenewals: 2,
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date('2026-02-15')
  },
  {
    _id: 'borrowal3',
    bookId: 'book4',
    book: mockBooks.find(b => b._id === 'book4'),
    userId: 'user5',
    user: mockUsers.find(u => u._id === 'user5'),
    issueDate: new Date('2026-01-15'),
    dueDate: new Date('2026-02-15'),
    returnDate: new Date('2026-02-12'),
    status: 'returned',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-12')
  },
  // Additional Borrowals for Members
  {
    _id: 'borrowal4',
    bookId: 'book6',
    book: mockBooks.find(b => b._id === 'book6'),
    userId: 'user3',
    user: mockUsers.find(u => u._id === 'user3'),
    issueDate: new Date('2026-02-15'),
    dueDate: new Date('2026-03-15'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15')
  },
  {
    _id: 'borrowal5',
    bookId: 'book11',
    book: mockBooks.find(b => b._id === 'book11'),
    userId: 'user6',
    user: mockUsers.find(u => u._id === 'user6'),
    issueDate: new Date('2026-02-12'),
    dueDate: new Date('2026-03-12'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-12'),
    updatedAt: new Date('2026-02-12')
  },
  {
    _id: 'borrowal6',
    bookId: 'book12',
    book: mockBooks.find(b => b._id === 'book12'),
    userId: 'user6',
    user: mockUsers.find(u => u._id === 'user6'),
    issueDate: new Date('2026-01-28'),
    dueDate: new Date('2026-03-10'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 1,
    maxRenewals: 2,
    createdAt: new Date('2026-01-28'),
    updatedAt: new Date('2026-02-10')
  },
  {
    _id: 'borrowal7',
    bookId: 'book7',
    book: mockBooks.find(b => b._id === 'book7'),
    userId: 'user7',
    user: mockUsers.find(u => u._id === 'user7'),
    issueDate: new Date('2026-01-20'),
    dueDate: new Date('2026-02-20'),
    returnDate: new Date('2026-02-18'),
    status: 'returned',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-02-18')
  },
  {
    _id: 'borrowal8',
    bookId: 'book13',
    book: mockBooks.find(b => b._id === 'book13'),
    userId: 'user7',
    user: mockUsers.find(u => u._id === 'user7'),
    issueDate: new Date('2026-02-08'),
    dueDate: new Date('2026-03-08'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-08'),
    updatedAt: new Date('2026-02-08')
  },
  {
    _id: 'borrowal9',
    bookId: 'book16',
    book: mockBooks.find(b => b._id === 'book16'),
    userId: 'user8',
    user: mockUsers.find(u => u._id === 'user8'),
    issueDate: new Date('2026-02-03'),
    dueDate: new Date('2026-03-03'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-03'),
    updatedAt: new Date('2026-02-03')
  },
  {
    _id: 'borrowal10',
    bookId: 'book17',
    book: mockBooks.find(b => b._id === 'book17'),
    userId: 'user8',
    user: mockUsers.find(u => u._id === 'user8'),
    issueDate: new Date('2026-01-22'),
    dueDate: new Date('2026-02-22'),
    returnDate: new Date('2026-02-20'),
    status: 'returned',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-01-22'),
    updatedAt: new Date('2026-02-20')
  },
  {
    _id: 'borrowal11',
    bookId: 'book18',
    book: mockBooks.find(b => b._id === 'book18'),
    userId: 'user9',
    user: mockUsers.find(u => u._id === 'user9'),
    issueDate: new Date('2026-01-25'),
    dueDate: new Date('2026-03-08'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 1,
    maxRenewals: 2,
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-02-08')
  },
  {
    _id: 'borrowal12',
    bookId: 'book19',
    book: mockBooks.find(b => b._id === 'book19'),
    userId: 'user9',
    user: mockUsers.find(u => u._id === 'user9'),
    issueDate: new Date('2026-01-05'),
    dueDate: new Date('2026-02-05'),
    returnDate: new Date('2026-02-03'),
    status: 'returned',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-02-03')
  },
  {
    _id: 'borrowal13',
    bookId: 'book2',
    book: mockBooks.find(b => b._id === 'book2'),
    userId: 'user10',
    user: mockUsers.find(u => u._id === 'user10'),
    issueDate: new Date('2026-02-09'),
    dueDate: new Date('2026-03-09'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-09'),
    updatedAt: new Date('2026-02-09')
  },
  {
    _id: 'borrowal14',
    bookId: 'book21',
    book: mockBooks.find(b => b._id === 'book21'),
    userId: 'user10',
    user: mockUsers.find(u => u._id === 'user10'),
    issueDate: new Date('2026-01-18'),
    dueDate: new Date('2026-02-18'),
    returnDate: new Date('2026-02-16'),
    status: 'returned',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-02-16')
  },
  {
    _id: 'borrowal15',
    bookId: 'book22',
    book: mockBooks.find(b => b._id === 'book22'),
    userId: 'user11',
    user: mockUsers.find(u => u._id === 'user11'),
    issueDate: new Date('2026-02-11'),
    dueDate: new Date('2026-03-11'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-11'),
    updatedAt: new Date('2026-02-11')
  },
  {
    _id: 'borrowal16',
    bookId: 'book14',
    book: mockBooks.find(b => b._id === 'book14'),
    userId: 'user11',
    user: mockUsers.find(u => u._id === 'user11'),
    issueDate: new Date('2025-12-28'),
    dueDate: new Date('2026-01-28'),
    returnDate: new Date('2026-01-26'),
    status: 'returned',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2026-01-26')
  },
  {
    _id: 'borrowal17',
    bookId: 'book24',
    book: mockBooks.find(b => b._id === 'book24'),
    userId: 'user12',
    user: mockUsers.find(u => u._id === 'user12'),
    issueDate: new Date('2026-02-17'),
    dueDate: new Date('2026-03-17'),
    returnDate: null,
    status: 'issued',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-02-17'),
    updatedAt: new Date('2026-02-17')
  },
  {
    _id: 'borrowal18',
    bookId: 'book15',
    book: mockBooks.find(b => b._id === 'book15'),
    userId: 'user12',
    user: mockUsers.find(u => u._id === 'user12'),
    issueDate: new Date('2026-01-10'),
    dueDate: new Date('2026-02-10'),
    returnDate: new Date('2026-02-08'),
    status: 'returned',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-02-08')
  },
  // Some overdue borrowals
  {
    _id: 'borrowal19',
    bookId: 'book9',
    book: mockBooks.find(b => b._id === 'book9'),
    userId: 'user4',
    user: mockUsers.find(u => u._id === 'user4'),
    issueDate: new Date('2025-12-15'),
    dueDate: new Date('2026-01-15'),
    returnDate: null,
    status: 'overdue',
    fine: 215,
    renewalCount: 2,
    maxRenewals: 2,
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2026-01-15')
  },
  {
    _id: 'borrowal20',
    bookId: 'book10',
    book: mockBooks.find(b => b._id === 'book10'),
    userId: 'user5',
    user: mockUsers.find(u => u._id === 'user5'),
    issueDate: new Date('2025-12-20'),
    dueDate: new Date('2026-02-05'),
    returnDate: null,
    status: 'overdue',
    fine: 110,
    renewalCount: 1,
    maxRenewals: 2,
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2026-01-20')
  },
  // Returned with fine
  {
    _id: 'borrowal21',
    bookId: 'book23',
    book: mockBooks.find(b => b._id === 'book23'),
    userId: 'user4',
    user: mockUsers.find(u => u._id === 'user4'),
    issueDate: new Date('2025-12-05'),
    dueDate: new Date('2026-01-05'),
    returnDate: new Date('2026-01-10'),
    status: 'returned',
    fine: 25,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2025-12-05'),
    updatedAt: new Date('2026-01-10')
  },
  {
    _id: 'borrowal22',
    bookId: 'book5',
    book: mockBooks.find(b => b._id === 'book5'),
    userId: 'user8',
    user: mockUsers.find(u => u._id === 'user8'),
    issueDate: new Date('2025-12-10'),
    dueDate: new Date('2026-01-10'),
    returnDate: new Date('2026-01-15'),
    status: 'returned',
    fine: 25,
    renewalCount: 0,
    maxRenewals: 2,
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2026-01-15')
  }
];

// Mock Reservations Data (for seats)
const mockReservations = [
  {
    _id: 'reservation1',
    userId: 'user3',
    user: mockUsers.find(u => u._id === 'user3'),
    seatId: 'seat_1A01',
    seatNumber: '1A01',
    floor: 1,
    section: 'A',
    seatType: 'Study Desk',
    location: 'Floor 1, Section A',
    reservationDate: new Date('2026-03-02'),
    startTime: new Date('2026-03-02T09:00:00'),
    endTime: new Date('2026-03-02T13:00:00'),
    status: 'confirmed',
    purpose: 'Study session',
    createdAt: new Date('2026-02-26'),
    updatedAt: new Date('2026-02-26')
  },
  {
    _id: 'reservation2',
    userId: 'user4',
    user: mockUsers.find(u => u._id === 'user4'),
    seatId: 'seat_2B05',
    seatNumber: '2B05',
    floor: 2,
    section: 'B',
    seatType: 'Reading Chair',
    location: 'Floor 2, Section B',
    reservationDate: new Date('2026-03-03'),
    startTime: new Date('2026-03-03T14:00:00'),
    endTime: new Date('2026-03-03T18:00:00'),
    status: 'confirmed',
    purpose: 'Research work',
    createdAt: new Date('2026-02-27'),
    updatedAt: new Date('2026-02-27')
  },
  // Additional Reservations for Members
  {
    _id: 'reservation3',
    userId: 'user6',
    user: mockUsers.find(u => u._id === 'user6'),
    seatId: 'seat_1C07',
    seatNumber: '1C07',
    floor: 1,
    section: 'C',
    seatType: 'Study Desk',
    location: 'Floor 1, Section C',
    reservationDate: new Date('2026-03-04'),
    startTime: new Date('2026-03-04T10:00:00'),
    endTime: new Date('2026-03-04T14:00:00'),
    status: 'confirmed',
    purpose: 'Exam preparation',
    createdAt: new Date('2026-02-28'),
    updatedAt: new Date('2026-02-28')
  },
  {
    _id: 'reservation4',
    userId: 'user6',
    user: mockUsers.find(u => u._id === 'user6'),
    seatId: 'seat_2A03',
    seatNumber: '2A03',
    floor: 2,
    section: 'A',
    seatType: 'Study Desk',
    location: 'Floor 2, Section A',
    reservationDate: new Date('2026-02-20'),
    startTime: new Date('2026-02-20T13:00:00'),
    endTime: new Date('2026-02-20T17:00:00'),
    status: 'completed',
    purpose: 'Project work',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-20')
  },
  {
    _id: 'reservation5',
    userId: 'user7',
    user: mockUsers.find(u => u._id === 'user7'),
    seatId: 'seat_3D10',
    seatNumber: '3D10',
    floor: 3,
    section: 'D',
    seatType: 'Private Cabin',
    location: 'Floor 3, Section D',
    reservationDate: new Date('2026-03-05'),
    startTime: new Date('2026-03-05T08:00:00'),
    endTime: new Date('2026-03-05T12:00:00'),
    status: 'confirmed',
    purpose: 'Thesis writing',
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    _id: 'reservation6',
    userId: 'user7',
    user: mockUsers.find(u => u._id === 'user7'),
    seatId: 'seat_1B12',
    seatNumber: '1B12',
    floor: 1,
    section: 'B',
    seatType: 'Reading Chair',
    location: 'Floor 1, Section B',
    reservationDate: new Date('2026-02-22'),
    startTime: new Date('2026-02-22T15:00:00'),
    endTime: new Date('2026-02-22T19:00:00'),
    status: 'completed',
    purpose: 'General reading',
    createdAt: new Date('2026-02-18'),
    updatedAt: new Date('2026-02-22')
  },
  {
    _id: 'reservation7',
    userId: 'user8',
    user: mockUsers.find(u => u._id === 'user8'),
    seatId: 'seat_2C09',
    seatNumber: '2C09',
    floor: 2,
    section: 'C',
    seatType: 'Study Desk',
    location: 'Floor 2, Section C',
    reservationDate: new Date('2026-03-06'),
    startTime: new Date('2026-03-06T11:00:00'),
    endTime: new Date('2026-03-06T15:00:00'),
    status: 'confirmed',
    purpose: 'Group study',
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02')
  },
  {
    _id: 'reservation8',
    userId: 'user9',
    user: mockUsers.find(u => u._id === 'user9'),
    seatId: 'seat_3A05',
    seatNumber: '3A05',
    floor: 3,
    section: 'A',
    seatType: 'Study Desk',
    location: 'Floor 3, Section A',
    reservationDate: new Date('2026-03-07'),
    startTime: new Date('2026-03-07T09:00:00'),
    endTime: new Date('2026-03-07T13:00:00'),
    status: 'confirmed',
    purpose: 'Assignment completion',
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-03')
  },
  {
    _id: 'reservation9',
    userId: 'user9',
    user: mockUsers.find(u => u._id === 'user9'),
    seatId: 'seat_1D08',
    seatNumber: '1D08',
    floor: 1,
    section: 'D',
    seatType: 'Reading Chair',
    location: 'Floor 1, Section D',
    reservationDate: new Date('2026-02-18'),
    startTime: new Date('2026-02-18T16:00:00'),
    endTime: new Date('2026-02-18T20:00:00'),
    status: 'completed',
    purpose: 'Literature review',
    createdAt: new Date('2026-02-14'),
    updatedAt: new Date('2026-02-18')
  },
  {
    _id: 'reservation10',
    userId: 'user10',
    user: mockUsers.find(u => u._id === 'user10'),
    seatId: 'seat_2D06',
    seatNumber: '2D06',
    floor: 2,
    section: 'D',
    seatType: 'Private Cabin',
    location: 'Floor 2, Section D',
    reservationDate: new Date('2026-03-08'),
    startTime: new Date('2026-03-08T10:00:00'),
    endTime: new Date('2026-03-08T14:00:00'),
    status: 'confirmed',
    purpose: 'Research paper',
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04')
  },
  {
    _id: 'reservation11',
    userId: 'user11',
    user: mockUsers.find(u => u._id === 'user11'),
    seatId: 'seat_1A10',
    seatNumber: '1A10',
    floor: 1,
    section: 'A',
    seatType: 'Study Desk',
    location: 'Floor 1, Section A',
    reservationDate: new Date('2026-03-01'),
    startTime: new Date('2026-03-01T14:00:00'),
    endTime: new Date('2026-03-01T18:00:00'),
    status: 'confirmed',
    purpose: 'Coding practice',
    createdAt: new Date('2026-02-25'),
    updatedAt: new Date('2026-02-25')
  },
  {
    _id: 'reservation12',
    userId: 'user11',
    user: mockUsers.find(u => u._id === 'user11'),
    seatId: 'seat_3B04',
    seatNumber: '3B04',
    floor: 3,
    section: 'B',
    seatType: 'Reading Chair',
    location: 'Floor 3, Section B',
    reservationDate: new Date('2026-02-19'),
    startTime: new Date('2026-02-19T12:00:00'),
    endTime: new Date('2026-02-19T16:00:00'),
    status: 'completed',
    purpose: 'Book reading',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-19')
  },
  {
    _id: 'reservation13',
    userId: 'user12',
    user: mockUsers.find(u => u._id === 'user12'),
    seatId: 'seat_2A11',
    seatNumber: '2A11',
    floor: 2,
    section: 'A',
    seatType: 'Study Desk',
    location: 'Floor 2, Section A',
    reservationDate: new Date('2026-03-09'),
    startTime: new Date('2026-03-09T08:00:00'),
    endTime: new Date('2026-03-09T12:00:00'),
    status: 'confirmed',
    purpose: 'Lab report',
    createdAt: new Date('2026-03-05'),
    updatedAt: new Date('2026-03-05')
  },
  {
    _id: 'reservation14',
    userId: 'user3',
    user: mockUsers.find(u => u._id === 'user3'),
    seatId: 'seat_3C06',
    seatNumber: '3C06',
    floor: 3,
    section: 'C',
    seatType: 'Private Cabin',
    location: 'Floor 3, Section C',
    reservationDate: new Date('2026-02-21'),
    startTime: new Date('2026-02-21T13:00:00'),
    endTime: new Date('2026-02-21T17:00:00'),
    status: 'completed',
    purpose: 'Interview preparation',
    createdAt: new Date('2026-02-17'),
    updatedAt: new Date('2026-02-21')
  },
  {
    _id: 'reservation15',
    userId: 'user4',
    user: mockUsers.find(u => u._id === 'user4'),
    seatId: 'seat_1C14',
    seatNumber: '1C14',
    floor: 1,
    section: 'C',
    seatType: 'Study Desk',
    location: 'Floor 1, Section C',
    reservationDate: new Date('2026-02-23'),
    startTime: new Date('2026-02-23T10:00:00'),
    endTime: new Date('2026-02-23T14:00:00'),
    status: 'cancelled',
    purpose: 'Tutorial session',
    createdAt: new Date('2026-02-19'),
    updatedAt: new Date('2026-02-22')
  },
  {
    _id: 'reservation16',
    userId: 'user5',
    user: mockUsers.find(u => u._id === 'user5'),
    seatId: 'seat_2B10',
    seatNumber: '2B10',
    floor: 2,
    section: 'B',
    seatType: 'Reading Chair',
    location: 'Floor 2, Section B',
    reservationDate: new Date('2026-03-10'),
    startTime: new Date('2026-03-10T15:00:00'),
    endTime: new Date('2026-03-10T19:00:00'),
    status: 'confirmed',
    purpose: 'Online course',
    createdAt: new Date('2026-03-06'),
    updatedAt: new Date('2026-03-06')
  }
];

// Mock Book Reviews Data
const mockBookReviews = [
  {
    _id: 'review1',
    bookId: 'book1',
    userId: 'user3',
    userName: 'Amit Patel',
    rating: 5,
    review: 'Excellent book on code quality and best practices. Every developer should read this!',
    createdAt: new Date('2026-02-16'),
    helpful: 12
  },
  {
    _id: 'review2',
    bookId: 'book1',
    userId: 'user6',
    userName: 'Ananya Iyer',
    rating: 4,
    review: 'Very insightful but can be a bit verbose at times.',
    createdAt: new Date('2026-02-18'),
    helpful: 8
  },
  {
    _id: 'review3',
    bookId: 'book4',
    userId: 'user5',
    userName: 'Vikram Singh',
    rating: 5,
    review: 'A magical journey! Still one of my favorites after all these years.',
    createdAt: new Date('2026-02-13'),
    helpful: 15
  },
  {
    _id: 'review4',
    bookId: 'book7',
    userId: 'user7',
    userName: 'Rohan Gupta',
    rating: 5,
    review: 'Must-read for any programmer. Practical lessons that apply to real-world development.',
    createdAt: new Date('2026-02-19'),
    helpful: 10
  },
  {
    _id: 'review5',
    bookId: 'book10',
    userId: 'user9',
    userName: 'Aditya Sharma',
    rating: 4,
    review: 'Comprehensive and detailed. Great reference book for algorithms.',
    createdAt: new Date('2026-02-09'),
    helpful: 7
  },
  {
    _id: 'review6',
    bookId: 'book13',
    userId: 'user7',
    userName: 'Rohan Gupta',
    rating: 5,
    review: 'Gripping thriller! Couldn\'t put it down.',
    createdAt: new Date('2026-02-14'),
    helpful: 9
  },
  {
    _id: 'review7',
    bookId: 'book16',
    userId: 'user8',
    userName: 'Kavya Nair',
    rating: 5,
    review: 'Hawking makes complex physics accessible to everyone. Brilliant!',
    createdAt: new Date('2026-02-10'),
    helpful: 11
  },
  {
    _id: 'review8',
    bookId: 'book5',
    userId: 'user8',
    userName: 'Kavya Nair',
    rating: 5,
    review: 'Hauntingly relevant even today. A must-read classic.',
    createdAt: new Date('2026-01-26'),
    helpful: 14
  },
  {
    _id: 'review9',
    bookId: 'book12',
    userId: 'user6',
    userName: 'Ananya Iyer',
    rating: 5,
    review: 'Deep dive into JavaScript. Highly recommended for serious JS developers.',
    createdAt: new Date('2026-02-06'),
    helpful: 6
  },
  {
    _id: 'review10',
    bookId: 'book20',
    userId: 'user12',
    userName: 'Meera Desai',
    rating: 4,
    review: 'Great for interview prep. Has most common coding patterns.',
    createdAt: new Date('2026-02-17'),
    helpful: 13
  }
];

// Mock Reading Statistics (for member dashboard)
const mockReadingStats = [
  {
    userId: 'user3',
    booksRead: 12,
    booksCurrentlyReading: 2,
    favoriteGenres: ['Computer Science', 'Programming'],
    readingGoal: 24,
    readingProgress: 50,
    totalHoursRead: 85,
    averageRating: 4.5
  },
  {
    userId: 'user4',
    booksRead: 8,
    booksCurrentlyReading: 2,
    favoriteGenres: ['Literature', 'Mystery'],
    readingGoal: 20,
    readingProgress: 40,
    totalHoursRead: 62,
    averageRating: 4.2
  },
  {
    userId: 'user5',
    booksRead: 15,
    booksCurrentlyReading: 1,
    favoriteGenres: ['Literature', 'Science'],
    readingGoal: 30,
    readingProgress: 50,
    totalHoursRead: 98,
    averageRating: 4.7
  },
  {
    userId: 'user6',
    booksRead: 10,
    booksCurrentlyReading: 2,
    favoriteGenres: ['Programming', 'Web Development'],
    readingGoal: 25,
    readingProgress: 40,
    totalHoursRead: 72,
    averageRating: 4.4
  },
  {
    userId: 'user7',
    booksRead: 14,
    booksCurrentlyReading: 1,
    favoriteGenres: ['Mystery', 'Science'],
    readingGoal: 28,
    readingProgress: 50,
    totalHoursRead: 89,
    averageRating: 4.6
  },
  {
    userId: 'user8',
    booksRead: 11,
    booksCurrentlyReading: 1,
    favoriteGenres: ['Science', 'Literature'],
    readingGoal: 22,
    readingProgress: 50,
    totalHoursRead: 76,
    averageRating: 4.5
  },
  {
    userId: 'user9',
    booksRead: 9,
    booksCurrentlyReading: 1,
    favoriteGenres: ['Computer Science', 'Programming'],
    readingGoal: 20,
    readingProgress: 45,
    totalHoursRead: 65,
    averageRating: 4.3
  },
  {
    userId: 'user10',
    booksRead: 13,
    booksCurrentlyReading: 1,
    favoriteGenres: ['Literature', 'Computer Science'],
    readingGoal: 26,
    readingProgress: 50,
    totalHoursRead: 82,
    averageRating: 4.4
  },
  {
    userId: 'user11',
    booksRead: 7,
    booksCurrentlyReading: 1,
    favoriteGenres: ['Mystery', 'Literature'],
    readingGoal: 18,
    readingProgress: 39,
    totalHoursRead: 54,
    averageRating: 4.1
  },
  {
    userId: 'user12',
    booksRead: 16,
    booksCurrentlyReading: 1,
    favoriteGenres: ['Programming', 'Computer Science'],
    readingGoal: 32,
    readingProgress: 50,
    totalHoursRead: 105,
    averageRating: 4.8
  }
];

// Mock Popular Books (trending among members)
const mockPopularBooks = [
  { bookId: 'book1', borrowCount: 45, rating: 4.7 },
  { bookId: 'book20', borrowCount: 62, rating: 4.5 },
  { bookId: 'book7', borrowCount: 38, rating: 4.8 },
  { bookId: 'book10', borrowCount: 41, rating: 4.6 },
  { bookId: 'book4', borrowCount: 55, rating: 4.9 },
  { bookId: 'book13', borrowCount: 48, rating: 4.4 },
  { bookId: 'book16', borrowCount: 33, rating: 4.7 },
  { bookId: 'book12', borrowCount: 29, rating: 4.6 }
];

// Mock Recently Added Books
const mockRecentBooks = ['book20', 'book18', 'book23', 'book25', 'book21'];

// Mock Recommended Books for Users (personalized)
const mockRecommendations = {
  user3: ['book7', 'book18', 'book25'],
  user4: ['book14', 'book15', 'book22'],
  user5: ['book17', 'book23', 'book15'],
  user6: ['book11', 'book12', 'book18'],
  user7: ['book13', 'book14', 'book16'],
  user8: ['book16', 'book17', 'book23'],
  user9: ['book10', 'book19', 'book25'],
  user10: ['book9', 'book18', 'book15'],
  user11: ['book13', 'book14', 'book21'],
  user12: ['book6', 'book9', 'book20']
};

// Mock Students Data
const mockStudents = [
  {
    _id: 'student1',
    fullName: 'Rahul Verma',
    scholarNumber: 'SCH2024001',
    enrollmentNumber: 'EN2024001',
    rfidCard: 'RFID-STU-2024-001',
    course: 'B.Tech',
    branch: 'Computer Science',
    year: 2,
    semester: 4,
    section: 'A',
    contactNumber: '9876543220',
    email: 'rahul.verma@student.edu',
    address: '123 Main Street, Delhi, India',
    admissionDate: new Date('2023-08-01'),
    status: 'Active',
    photoUrl: 'https://avatars.dicebear.com/api/male/Rahul+Verma.svg',
    totalBooksIssued: 2,
    maxBookLimit: 5,
    availableBookLimit: 3,
    fineAmount: 50,
    unpaidFine: 50,
    lostDamagedBooks: [],
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'student2',
    fullName: 'Anjali Kapoor',
    scholarNumber: 'SCH2024002',
    enrollmentNumber: 'EN2024002',
    rfidCard: 'RFID-STU-2024-002',
    course: 'B.Tech',
    branch: 'Electronics',
    year: 3,
    semester: 6,
    section: 'B',
    contactNumber: '9876543221',
    email: 'anjali.kapoor@student.edu',
    address: '456 Park Avenue, Mumbai, India',
    admissionDate: new Date('2022-08-01'),
    status: 'Active',
    photoUrl: 'https://avatars.dicebear.com/api/female/Anjali+Kapoor.svg',
    totalBooksIssued: 1,
    maxBookLimit: 5,
    availableBookLimit: 4,
    fineAmount: 0,
    unpaidFine: 0,
    lostDamagedBooks: [],
    createdAt: new Date('2022-08-01'),
    updatedAt: new Date('2024-11-30')
  },
  {
    _id: 'student3',
    fullName: 'Arjun Mehta',
    scholarNumber: 'SCH2024003',
    enrollmentNumber: 'EN2024003',
    rfidCard: 'RFID-STU-2024-003',
    course: 'M.Tech',
    branch: 'Data Science',
    year: 1,
    semester: 2,
    section: 'A',
    contactNumber: '9876543222',
    email: 'arjun.mehta@student.edu',
    address: '789 Sector 12, Bangalore, India',
    admissionDate: new Date('2024-08-01'),
    status: 'Blocked',
    blockReason: 'Multiple overdue books',
    photoUrl: 'https://avatars.dicebear.com/api/male/Arjun+Mehta.svg',
    totalBooksIssued: 3,
    maxBookLimit: 5,
    availableBookLimit: 2,
    fineAmount: 250,
    unpaidFine: 250,
    lostDamagedBooks: [
      {
        _id: 'lost1',
        bookName: 'Advanced Algorithms',
        type: 'Lost',
        date: new Date('2024-10-15'),
        fineAmount: 500,
        status: 'Unpaid'
      }
    ],
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-11-30')
  }
];

// Mock Student Issued Books
const mockStudentIssuedBooks = [
  {
    _id: 'issue1',
    studentId: 'student1',
    bookId: 'book1',
    bookName: 'Clean Code',
    issueDate: new Date('2024-11-10'),
    dueDate: new Date('2024-11-24'),
    returnDate: null,
    isOverdue: true,
    lateDays: 6,
    fine: 30,
    status: 'Issued'
  },
  {
    _id: 'issue2',
    studentId: 'student1',
    bookId: 'book2',
    bookName: 'The C++ Programming Language',
    issueDate: new Date('2024-11-20'),
    dueDate: new Date('2024-12-04'),
    returnDate: null,
    isOverdue: false,
    lateDays: 0,
    fine: 0,
    status: 'Issued'
  },
  {
    _id: 'issue3',
    studentId: 'student2',
    bookId: 'book4',
    bookName: 'Harry Potter and the Philosopher\'s Stone',
    issueDate: new Date('2024-11-22'),
    dueDate: new Date('2024-12-06'),
    returnDate: null,
    isOverdue: false,
    lateDays: 0,
    fine: 0,
    status: 'Issued'
  }
];

// Mock Student Transaction History
const mockStudentTransactions = [
  {
    _id: 'trans1',
    studentId: 'student1',
    bookName: 'Design Patterns',
    issueDate: new Date('2024-10-01'),
    dueDate: new Date('2024-10-15'),
    returnDate: new Date('2024-10-20'),
    lateDays: 5,
    fine: 25,
    fineStatus: 'Paid'
  },
  {
    _id: 'trans2',
    studentId: 'student1',
    bookName: 'Clean Code',
    issueDate: new Date('2024-11-10'),
    dueDate: new Date('2024-11-24'),
    returnDate: null,
    lateDays: 6,
    fine: 30,
    fineStatus: 'Unpaid'
  },
  {
    _id: 'trans3',
    studentId: 'student2',
    bookName: '1984',
    issueDate: new Date('2024-10-10'),
    dueDate: new Date('2024-10-24'),
    returnDate: new Date('2024-10-22'),
    lateDays: 0,
    fine: 0,
    fineStatus: 'No Fine'
  }
];

// Mock Check-In/Check-Out Data
const mockCheckIns = [
  {
    _id: 'checkin1',
    studentId: 'student1',
    student: mockStudents.find(s => s._id === 'student1'),
    rfidCard: 'RFID-STU-2024-001',
    checkInTime: new Date('2024-11-30T08:30:00'),
    checkOutTime: new Date('2024-11-30T14:30:00'),
    status: 'checked-out',
    createdAt: new Date('2024-11-30T08:30:00'),
    updatedAt: new Date('2024-11-30T14:30:00')
  },
  {
    _id: 'checkin2',
    studentId: 'student2',
    student: mockStudents.find(s => s._id === 'student2'),
    rfidCard: 'RFID-STU-2024-002',
    checkInTime: new Date('2024-11-30T09:00:00'),
    checkOutTime: null,
    status: 'checked-in',
    createdAt: new Date('2024-11-30T09:00:00'),
    updatedAt: new Date('2024-11-30T09:00:00')
  },
  {
    _id: 'checkin3',
    studentId: 'student1',
    student: mockStudents.find(s => s._id === 'student1'),
    rfidCard: 'RFID-STU-2024-001',
    checkInTime: new Date('2024-11-29T10:00:00'),
    checkOutTime: new Date('2024-11-29T16:30:00'),
    status: 'checked-out',
    createdAt: new Date('2024-11-29T10:00:00'),
    updatedAt: new Date('2024-11-29T16:30:00')
  },
  {
    _id: 'checkin4',
    studentId: 'student3',
    student: mockStudents.find(s => s._id === 'student3'),
    rfidCard: 'RFID-STU-2024-003',
    checkInTime: new Date('2024-11-30T11:00:00'),
    checkOutTime: null,
    status: 'checked-in',
    createdAt: new Date('2024-11-30T11:00:00'),
    updatedAt: new Date('2024-11-30T11:00:00')
  },
  {
    _id: 'checkin5',
    studentId: 'student2',
    student: mockStudents.find(s => s._id === 'student2'),
    rfidCard: 'RFID-STU-2024-002',
    checkInTime: new Date('2024-11-28T08:00:00'),
    checkOutTime: new Date('2024-11-28T17:00:00'),
    status: 'checked-out',
    createdAt: new Date('2024-11-28T08:00:00'),
    updatedAt: new Date('2024-11-28T17:00:00')
  }
];

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
class MockDataService {
  // Users
  static async getAllUsers() {
    await simulateDelay();
    return {
      success: true,
      usersList: [...mockUsers],
      message: 'Users retrieved successfully'
    };
  }

  static async addUser(userData) {
    await simulateDelay();
    const newUser = {
      ...userData,
      _id: generateId(),
      status: 'active',
      joinDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockUsers.push(newUser);
    return {
      success: true,
      user: newUser,
      message: 'User added successfully'
    };
  }

  static async updateUser(userId, userData) {
    await simulateDelay();
    const userIndex = mockUsers.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date()
    };
    return {
      success: true,
      user: mockUsers[userIndex],
      message: 'User updated successfully'
    };
  }

  static async deleteUser(userId) {
    await simulateDelay();
    const userIndex = mockUsers.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(userIndex, 1);
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }

  // Books
  static async getAllBooks() {
    await simulateDelay();
    return {
      success: true,
      booksList: [...mockBooks],
      message: 'Books retrieved successfully'
    };
  }

  static async addBook(bookData) {
    await simulateDelay();
    const author = mockAuthors.find(a => a._id === bookData.authorId);
    const genre = mockGenres.find(g => g._id === bookData.genreId);
    
    const newBook = {
      ...bookData,
      _id: generateId(),
      author,
      genre,
      isAvailable: bookData.availableCopies > 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockBooks.push(newBook);
    return {
      success: true,
      book: newBook,
      message: 'Book added successfully'
    };
  }

  static async updateBook(bookId, bookData) {
    await simulateDelay();
    const bookIndex = mockBooks.findIndex(b => b._id === bookId);
    if (bookIndex === -1) {
      throw new Error('Book not found');
    }
    
    const author = mockAuthors.find(a => a._id === bookData.authorId);
    const genre = mockGenres.find(g => g._id === bookData.genreId);
    
    mockBooks[bookIndex] = {
      ...mockBooks[bookIndex],
      ...bookData,
      author,
      genre,
      isAvailable: bookData.availableCopies > 0,
      updatedAt: new Date()
    };
    return {
      success: true,
      book: mockBooks[bookIndex],
      message: 'Book updated successfully'
    };
  }

  static async deleteBook(bookId) {
    await simulateDelay();
    const bookIndex = mockBooks.findIndex(b => b._id === bookId);
    if (bookIndex === -1) {
      throw new Error('Book not found');
    }
    mockBooks.splice(bookIndex, 1);
    return {
      success: true,
      message: 'Book deleted successfully'
    };
  }

  // Borrowals
  static async getAllBorrowals() {
    await simulateDelay();
    return {
      success: true,
      borrowalsList: [...mockBorrowals],
      message: 'Borrowals retrieved successfully'
    };
  }

  static async getUserBorrowals(userId) {
    await simulateDelay();
    const userBorrowals = mockBorrowals.filter(b => b.userId === userId);
    return {
      success: true,
      borrowalsList: userBorrowals,
      message: 'User borrowals retrieved successfully'
    };
  }

  static async issueBorrow(borrowData) {
    await simulateDelay();
    const book = mockBooks.find(b => b._id === borrowData.bookId);
    const user = mockUsers.find(u => u._id === borrowData.userId);
    
    if (!book || !user) {
      throw new Error('Book or user not found');
    }
    
    if (book.availableCopies <= 0) {
      throw new Error('No copies available');
    }

    const newBorrowal = {
      ...borrowData,
      _id: generateId(),
      book,
      user,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      returnDate: null,
      status: 'issued',
      fine: 0,
      renewalCount: 0,
      maxRenewals: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockBorrowals.push(newBorrowal);
    
    // Update book availability
    book.availableCopies -= 1;
    book.isAvailable = book.availableCopies > 0;
    
    return {
      success: true,
      borrowal: newBorrowal,
      message: 'Book issued successfully'
    };
  }

  static async returnBorrowal(borrowalId) {
    await simulateDelay();
    const borrowalIndex = mockBorrowals.findIndex(b => b._id === borrowalId);
    if (borrowalIndex === -1) {
      throw new Error('Borrowal not found');
    }

    const borrowal = mockBorrowals[borrowalIndex];
    const book = mockBooks.find(b => b._id === borrowal.bookId);
    
    borrowal.returnDate = new Date();
    borrowal.status = 'returned';
    borrowal.updatedAt = new Date();
    
    // Update book availability
    if (book) {
      book.availableCopies += 1;
      book.isAvailable = true;
    }
    
    return {
      success: true,
      borrowal,
      message: 'Book returned successfully'
    };
  }

  // Reservations
  static async getAllReservations() {
    await simulateDelay();
    return {
      success: true,
      reservationsList: [...mockReservations],
      message: 'Reservations retrieved successfully'
    };
  }

  static async getUserReservations(userId) {
    await simulateDelay();
    const userReservations = mockReservations.filter(r => r.userId === userId);
    return {
      success: true,
      reservationsList: userReservations,
      message: 'User reservations retrieved successfully'
    };
  }

  static async createReservation(reservationData) {
    await simulateDelay();
    const user = mockUsers.find(u => u._id === reservationData.userId);
    
    const newReservation = {
      ...reservationData,
      _id: generateId(),
      user,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockReservations.push(newReservation);
    
    return {
      success: true,
      reservation: newReservation,
      message: 'Reservation created successfully'
    };
  }

  static async cancelReservation(reservationId) {
    await simulateDelay();
    const reservationIndex = mockReservations.findIndex(r => r._id === reservationId);
    if (reservationIndex === -1) {
      throw new Error('Reservation not found');
    }

    mockReservations[reservationIndex].status = 'cancelled';
    mockReservations[reservationIndex].updatedAt = new Date();
    
    return {
      success: true,
      message: 'Reservation cancelled successfully'
    };
  }

  // Seats (uses existing mockSeatData.js)
  static async getSeats(floor = null) {
    await simulateDelay();
    let seats;
    if (floor) {
      seats = generateMockSeats(floor);
    } else {
      seats = [
        ...generateMockSeats(1),
        ...generateMockSeats(2),
        ...generateMockSeats(3)
      ];
    }
    return {
      success: true,
      seats,
      message: 'Seats retrieved successfully'
    };
  }

  static async getSeatStatistics() {
    await simulateDelay();
    const allSeats = [
      ...generateMockSeats(1),
      ...generateMockSeats(2),
      ...generateMockSeats(3)
    ];
    const statistics = generateMockStatistics(allSeats);
    return {
      success: true,
      data: statistics,
      message: 'Seat statistics retrieved successfully'
    };
  }

  // Authors and Genres (for dropdowns)
  static async getAllAuthors() {
    await simulateDelay();
    return {
      success: true,
      authorsList: [...mockAuthors],
      message: 'Authors retrieved successfully'
    };
  }

  static async getAllGenres() {
    await simulateDelay();
    return {
      success: true,
      genresList: [...mockGenres],
      message: 'Genres retrieved successfully'
    };
  }

  // Students Management
  static async getStudentByRFID(rfidData) {
    await simulateDelay();
    const student = mockStudents.find(s => s.rfidCard === rfidData);
    if (!student) {
      return null;
    }
    return student;
  }

  static async getStudentByScholarNumber(scholarNumber) {
    await simulateDelay();
    const student = mockStudents.find(s => s.scholarNumber === scholarNumber);
    if (!student) {
      return null;
    }
    return student;
  }

  static async getStudentByEnrollmentNumber(enrollmentNumber) {
    await simulateDelay();
    const student = mockStudents.find(s => s.enrollmentNumber === enrollmentNumber);
    if (!student) {
      return null;
    }
    return student;
  }

  static async getStudentById(studentId) {
    await simulateDelay();
    const student = mockStudents.find(s => s._id === studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  static async getIssuedBooksByStudent(studentId) {
    await simulateDelay();
    const issuedBooks = mockStudentIssuedBooks.filter(b => b.studentId === studentId && !b.returnDate);
    return issuedBooks;
  }

  static async getStudentTransactionHistory(studentId) {
    await simulateDelay();
    const transactions = mockStudentTransactions.filter(t => t.studentId === studentId);
    return transactions;
  }

  static async searchAvailableBooks(searchText) {
    await simulateDelay();
    const availableBooks = mockBooks.filter(book => 
      book.availableCopies > 0 && 
      (book.name.toLowerCase().includes(searchText.toLowerCase()) ||
       book.isbn.includes(searchText))
    );
    return availableBooks;
  }

  static async issueBook(issueData) {
    await simulateDelay();
    const student = mockStudents.find(s => s._id === issueData.studentId);
    const book = mockBooks.find(b => b._id === issueData.bookId);

    if (!student) {
      throw new Error('Student not found');
    }

    if (!book) {
      throw new Error('Book not found');
    }

    if (student.availableBookLimit <= 0) {
      throw new Error('Student has reached maximum book limit');
    }

    if (book.availableCopies <= 0) {
      throw new Error('No copies available');
    }

    if (student.status === 'Blocked') {
      throw new Error('Student is blocked from issuing books');
    }

    const newIssue = {
      _id: generateId(),
      studentId: issueData.studentId,
      bookId: issueData.bookId,
      bookName: book.name,
      issueDate: issueData.issueDate,
      dueDate: issueData.dueDate,
      returnDate: null,
      isOverdue: false,
      lateDays: 0,
      fine: 0,
      status: 'Issued'
    };

    mockStudentIssuedBooks.push(newIssue);

    // Update student stats
    student.totalBooksIssued += 1;
    student.availableBookLimit -= 1;

    // Update book availability
    book.availableCopies -= 1;
    book.isAvailable = book.availableCopies > 0;

    return {
      success: true,
      issue: newIssue,
      message: 'Book issued successfully'
    };
  }

  static async returnBook(returnData) {
    await simulateDelay();
    const issueIndex = mockStudentIssuedBooks.findIndex(b => b._id === returnData.bookId);
    
    if (issueIndex === -1) {
      throw new Error('Issue record not found');
    }

    const issue = mockStudentIssuedBooks[issueIndex];
    const student = mockStudents.find(s => s._id === returnData.studentId);
    const book = mockBooks.find(b => b._id === issue.bookId);

    // Update issue record
    issue.returnDate = returnData.returnDate;
    issue.status = 'Returned';

    // Update student stats
    if (student) {
      student.availableBookLimit += 1;
      if (returnData.fine > 0) {
        student.unpaidFine += returnData.fine;
        student.fineAmount += returnData.fine;
      }
    }

    // Update book availability
    if (book) {
      book.availableCopies += 1;
      book.isAvailable = true;
    }

    // Add to transaction history
    mockStudentTransactions.push({
      _id: generateId(),
      studentId: returnData.studentId,
      bookName: issue.bookName,
      issueDate: issue.issueDate,
      dueDate: issue.dueDate,
      returnDate: returnData.returnDate,
      lateDays: issue.lateDays,
      fine: returnData.fine,
      fineStatus: returnData.fine > 0 ? 'Unpaid' : 'No Fine'
    });

    return {
      success: true,
      message: 'Book returned successfully'
    };
  }

  static async collectFine(paymentData) {
    await simulateDelay();
    const student = mockStudents.find(s => s._id === paymentData.studentId);

    if (!student) {
      throw new Error('Student not found');
    }

    if (paymentData.amount > student.unpaidFine) {
      throw new Error('Payment amount exceeds unpaid fine');
    }

    student.unpaidFine -= paymentData.amount;

    // Update transaction history to mark fines as paid
    mockStudentTransactions.forEach(trans => {
      if (trans.studentId === paymentData.studentId && trans.fineStatus === 'Unpaid') {
        trans.fineStatus = 'Paid';
      }
    });

    return {
      success: true,
      message: 'Fine collected successfully',
      remainingFine: student.unpaidFine
    };
  }

  static async blockStudent(studentId, reason) {
    await simulateDelay();
    const student = mockStudents.find(s => s._id === studentId);

    if (!student) {
      throw new Error('Student not found');
    }

    student.status = 'Blocked';
    student.blockReason = reason;
    student.updatedAt = new Date();

    return {
      success: true,
      message: 'Student blocked successfully'
    };
  }

  static async unblockStudent(studentId) {
    await simulateDelay();
    const student = mockStudents.find(s => s._id === studentId);

    if (!student) {
      throw new Error('Student not found');
    }

    student.status = 'Active';
    student.blockReason = '';
    student.updatedAt = new Date();

    return {
      success: true,
      message: 'Student unblocked successfully'
    };
  }

  // Check-In/Check-Out Management
  static async getAllCheckIns() {
    await simulateDelay();
    return {
      success: true,
      checkInsList: [...mockCheckIns].sort((a, b) => b.checkInTime - a.checkInTime),
      message: 'Check-in records retrieved successfully'
    };
  }

  static async checkInStudent(rfidCard) {
    await simulateDelay();
    
    // Find student by RFID card
    const student = mockStudents.find(s => s.rfidCard === rfidCard);
    
    if (!student) {
      throw new Error('Student not found with this RFID card');
    }

    if (student.status === 'Blocked') {
      throw new Error(`Student is blocked: ${student.blockReason}`);
    }

    // Check if student is already checked in
    const existingCheckIn = mockCheckIns.find(
      c => c.studentId === student._id && c.status === 'checked-in'
    );

    if (existingCheckIn) {
      throw new Error('Student is already checked in');
    }

    // Create new check-in record
    const newCheckIn = {
      _id: generateId(),
      studentId: student._id,
      student,
      rfidCard,
      checkInTime: new Date(),
      checkOutTime: null,
      status: 'checked-in',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockCheckIns.unshift(newCheckIn);

    return {
      success: true,
      checkIn: newCheckIn,
      student,
      message: 'Student checked in successfully'
    };
  }

  static async checkOutStudent(checkInId) {
    await simulateDelay();
    
    const checkIn = mockCheckIns.find(c => c._id === checkInId);
    
    if (!checkIn) {
      throw new Error('Check-in record not found');
    }

    if (checkIn.status === 'checked-out') {
      throw new Error('Student is already checked out');
    }

    // Update check-in record
    checkIn.checkOutTime = new Date();
    checkIn.status = 'checked-out';
    checkIn.updatedAt = new Date();

    return {
      success: true,
      checkIn,
      student: checkIn.student,
      message: 'Student checked out successfully'
    };
  }

  static async getStudentCheckInHistory(studentId) {
    await simulateDelay();
    
    const history = mockCheckIns.filter(c => c.studentId === studentId)
      .sort((a, b) => b.checkInTime - a.checkInTime);

    return {
      success: true,
      history,
      message: 'Check-in history retrieved successfully'
    };
  }

  // Book Reviews Methods
  static async getBookReviews(bookId) {
    await simulateDelay();
    const reviews = mockBookReviews.filter(r => r.bookId === bookId);
    return {
      success: true,
      reviews,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      totalReviews: reviews.length,
      message: 'Book reviews retrieved successfully'
    };
  }

  static async addBookReview(reviewData) {
    await simulateDelay();
    const user = mockUsers.find(u => u._id === reviewData.userId);
    
    const newReview = {
      ...reviewData,
      _id: generateId(),
      userName: user ? user.name : 'Anonymous',
      createdAt: new Date(),
      helpful: 0
    };
    
    mockBookReviews.push(newReview);
    
    return {
      success: true,
      review: newReview,
      message: 'Review added successfully'
    };
  }

  static async getUserReviews(userId) {
    await simulateDelay();
    const reviews = mockBookReviews.filter(r => r.userId === userId);
    return {
      success: true,
      reviews,
      message: 'User reviews retrieved successfully'
    };
  }

  // Reading Statistics Methods
  static async getUserReadingStats(userId) {
    await simulateDelay();
    const stats = mockReadingStats.find(s => s.userId === userId) || {
      userId,
      booksRead: 0,
      booksCurrentlyReading: 0,
      favoriteGenres: [],
      readingGoal: 20,
      readingProgress: 0,
      totalHoursRead: 0,
      averageRating: 0
    };
    
    return {
      success: true,
      stats,
      message: 'Reading statistics retrieved successfully'
    };
  }

  // Popular and Recommended Books Methods
  static async getPopularBooks() {
    await simulateDelay();
    const popularBooks = mockPopularBooks.map(pb => {
      const book = mockBooks.find(b => b._id === pb.bookId);
      return {
        ...book,
        borrowCount: pb.borrowCount,
        rating: pb.rating
      };
    }).filter(b => b);
    
    return {
      success: true,
      books: popularBooks,
      message: 'Popular books retrieved successfully'
    };
  }

  static async getRecentBooks() {
    await simulateDelay();
    const recentBooks = mockRecentBooks
      .map(bookId => mockBooks.find(b => b._id === bookId))
      .filter(b => b);
    
    return {
      success: true,
      books: recentBooks,
      message: 'Recent books retrieved successfully'
    };
  }

  static async getRecommendedBooks(userId) {
    await simulateDelay();
    const recommendedIds = mockRecommendations[userId] || [];
    const recommendedBooks = recommendedIds
      .map(bookId => mockBooks.find(b => b._id === bookId))
      .filter(b => b);
    
    return {
      success: true,
      books: recommendedBooks,
      message: 'Recommended books retrieved successfully'
    };
  }

  // Member Profile Methods
  static async updateMemberProfile(userId, profileData) {
    await simulateDelay();
    const userIndex = mockUsers.findIndex(u => u._id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...profileData,
      updatedAt: new Date()
    };
    
    return {
      success: true,
      user: mockUsers[userIndex],
      message: 'Profile updated successfully'
    };
  }

  // Renewal Methods
  static async renewBook(borrowalId) {
    await simulateDelay();
    const borrowalIndex = mockBorrowals.findIndex(b => b._id === borrowalId);
    
    if (borrowalIndex === -1) {
      throw new Error('Borrowal not found');
    }
    
    const borrowal = mockBorrowals[borrowalIndex];
    
    if (borrowal.renewalCount >= borrowal.maxRenewals) {
      throw new Error('Maximum renewals reached');
    }
    
    if (borrowal.status === 'overdue') {
      throw new Error('Cannot renew overdue books. Please pay fine first.');
    }
    
    // Extend due date by 14 days
    const newDueDate = new Date(borrowal.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);
    
    borrowal.dueDate = newDueDate;
    borrowal.renewalCount += 1;
    borrowal.updatedAt = new Date();
    
    return {
      success: true,
      borrowal,
      message: 'Book renewed successfully'
    };
  }

  // Fine Payment Methods
  static async payFine(borrowalId, amount) {
    await simulateDelay();
    const borrowalIndex = mockBorrowals.findIndex(b => b._id === borrowalId);
    
    if (borrowalIndex === -1) {
      throw new Error('Borrowal not found');
    }
    
    const borrowal = mockBorrowals[borrowalIndex];
    
    if (amount > borrowal.fine) {
      throw new Error('Payment amount exceeds fine amount');
    }
    
    borrowal.fine -= amount;
    borrowal.updatedAt = new Date();
    
    if (borrowal.fine === 0 && borrowal.status === 'overdue') {
      borrowal.status = 'issued';
    }
    
    return {
      success: true,
      borrowal,
      remainingFine: borrowal.fine,
      message: 'Fine payment processed successfully'
    };
  }

  // Member Dashboard Stats
  static async getMemberDashboardStats(userId) {
    await simulateDelay();
    
    const userBorrowals = mockBorrowals.filter(b => b.userId === userId);
    const activeBorrowals = userBorrowals.filter(b => b.status === 'issued' || b.status === 'overdue');
    const overdueBorrowals = userBorrowals.filter(b => b.status === 'overdue');
    const totalFines = userBorrowals.reduce((sum, b) => sum + b.fine, 0);
    
    const userReservations = mockReservations.filter(r => r.userId === userId);
    const activeReservations = userReservations.filter(r => r.status === 'confirmed');
    
    const readingStats = mockReadingStats.find(s => s.userId === userId) || {
      booksRead: 0,
      readingGoal: 20
    };
    
    return {
      success: true,
      stats: {
        activeBorrowals: activeBorrowals.length,
        overdueBorrowals: overdueBorrowals.length,
        totalFines,
        activeReservations: activeReservations.length,
        booksRead: readingStats.booksRead,
        readingGoal: readingStats.readingGoal,
        readingProgress: Math.round((readingStats.booksRead / readingStats.readingGoal) * 100)
      },
      message: 'Dashboard statistics retrieved successfully'
    };
  }
}

export default MockDataService;