// Mock seat data generator for demonstration purposes
// This generates hardcoded seat data to show in the UI before backend is ready

export const generateMockSeats = (floor = 1) => {
  const sections = ['A', 'B', 'C', 'D'];
  const seatsPerSection = 15;
  const mockSeats = [];
  
  // Mock user data
  const mockUsers = [
    { _id: 'user1', name: 'Rahul Sharma', email: 'rahul@example.com' },
    { _id: 'user2', name: 'Priya Patel', email: 'priya@example.com' },
    { _id: 'user3', name: 'Amit Kumar', email: 'amit@example.com' },
    { _id: 'user4', name: 'Sneha Reddy', email: 'sneha@example.com' },
    { _id: 'user5', name: 'Vikram Singh', email: 'vikram@example.com' },
  ];

  // Define which seats should be occupied/booked for demo
  const occupiedSeats = {
    1: { A: [1, 2, 5, 8], B: [3, 7, 11], C: [2, 6, 9, 12], D: [1, 4, 10] },
    2: { A: [3, 6, 9], B: [2, 5, 8, 13], C: [1, 7, 11], D: [3, 8, 14] },
    3: { A: [2, 7, 12], B: [4, 9], C: [3, 8, 13], D: [2, 6, 11, 15] },
  };

  const bookedSeats = {
    1: { A: [3, 7], B: [5, 9], C: [4, 8], D: [6, 12] },
    2: { A: [4, 10], B: [6, 12], C: [5, 10], D: [7, 13] },
    3: { A: [5, 11], B: [7, 13], C: [6, 12], D: [4, 9] },
  };

  const maintenanceSeats = {
    1: { A: [15], B: [], C: [15], D: [] },
    2: { A: [], B: [15], C: [], D: [15] },
    3: { A: [15], B: [], C: [15], D: [] },
  };

  sections.forEach((section) => {
    for (let i = 1; i <= seatsPerSection; i += 1) {
      const seatNumber = `${floor}${section}${i.toString().padStart(2, '0')}`;
      const seatId = `seat_${seatNumber}`;
      
      let status = 'available';
      let bookedBy = null;
      let bookingDate = null;
      let bookingStartTime = null;
      let bookingEndTime = null;
      let isAdvanceBooking = false;

      // Check if seat is in maintenance
      if (maintenanceSeats[floor]?.[section]?.includes(i)) {
        status = 'maintenance';
      }
      // Check if seat is occupied
      else if (occupiedSeats[floor]?.[section]?.includes(i)) {
        status = 'occupied';
        const userIndex = Math.floor(Math.random() * mockUsers.length);
        bookedBy = mockUsers[userIndex];
        bookingDate = new Date();
        bookingStartTime = new Date(Date.now() - 3600000); // 1 hour ago
        bookingEndTime = new Date(Date.now() + 7200000); // 2 hours from now
        isAdvanceBooking = false;
      }
      // Check if seat is booked (advance booking)
      else if (bookedSeats[floor]?.[section]?.includes(i)) {
        status = 'booked';
        const userIndex = Math.floor(Math.random() * mockUsers.length);
        bookedBy = mockUsers[userIndex];
        const futureDate = new Date(Date.now() + 86400000); // Tomorrow
        bookingDate = futureDate;
        bookingStartTime = new Date(futureDate.getTime() + 32400000); // Tomorrow at 9 AM
        bookingEndTime = new Date(futureDate.getTime() + 46800000); // Tomorrow at 1 PM
        isAdvanceBooking = true;
      }

      mockSeats.push({
        _id: seatId,
        seatNumber,
        floor,
        section,
        status,
        bookedBy,
        bookingDate,
        bookingStartTime,
        bookingEndTime,
        isAdvanceBooking,
        notes: status !== 'available' ? `Sample booking for ${section}${i}` : '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  return mockSeats;
};

export const generateMockStatistics = (seats) => {
  const total = seats.length;
  const available = seats.filter(s => s.status === 'available').length;
  const booked = seats.filter(s => s.status === 'booked').length;
  const occupied = seats.filter(s => s.status === 'occupied').length;
  const maintenance = seats.filter(s => s.status === 'maintenance').length;

  // Calculate today's bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayBookings = seats.filter(s => {
    if (!s.bookingDate) return false;
    const bookingDate = new Date(s.bookingDate);
    return bookingDate >= today && bookingDate < tomorrow;
  }).length;

  const occupancyRate = total > 0 ? ((occupied / total) * 100).toFixed(2) : 0;

  return {
    total,
    available,
    booked,
    occupied,
    maintenance,
    todayBookings,
    occupancyRate,
  };
};

export const generateMockCurrentBooking = (userId, seats) => {
  // For demo, randomly assign a booked seat to the current user
  const userSeats = seats.filter(s => s.status === 'occupied' && s.bookedBy);
  
  if (userSeats.length > 0) {
    const randomSeat = userSeats[Math.floor(Math.random() * userSeats.length)];
    return {
      ...randomSeat,
      bookedBy: { _id: userId, name: 'You', email: 'you@example.com' }
    };
  }
  
  return null;
};
