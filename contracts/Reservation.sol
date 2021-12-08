pragma solidity >=0.4.22 <0.9.0;

contract Reservation {
    uint256 public maxRooms = 20;
    uint256 public maxBookingsPerCompany = 10;

    struct User {
        uint256 id;
        string company;
        bool set;
    }

    struct Room {
        uint256 id;
        string name;
    }

    struct Booking {
        uint256 id;
        address user;
        uint256 roomId;
        uint256 startDate;
        bool cancelled;
    }

    mapping(address => User) public users;
    uint256 public usersCount;
    mapping(string => uint256) public companyBookingsCount;
    mapping(uint256 => Booking) public bookings;
    uint256 public bookingsCount;
    mapping(uint256 => Room) public rooms;
    uint256 public roomsCount;

    event RoomAdded(uint256 id, string name);
    event BookingCancelled(uint256 id, address user);
    event BookingAdded(
        uint256 id,
        address user,
        uint256 roomId,
        uint256 startDate
    );
    event BookingFailed(
        uint256 id,
        address user,
        uint256 roomId,
        uint256 startDate
    );

    function append(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    constructor() {
        bookingsCount = 0;
        roomsCount = 0;
        usersCount = 0;

        // NOTE: We assume that exists an external service registering users.
        createUser(0, 0x2cDB90d0F33FDE3c8802B021452cCfe5e1d25574, "CocaCola");
        createUser(1, 0xa4387a7E4e854DA0c83ADCC9514eBe581DCe85D4, "PepsiCola");

        for (uint256 i = 0; i < maxRooms; i++) {
            addRoom(append("Room ", toString(i)));
        }
    }

    function createUser(
        uint256 _userId,
        address _userAddress,
        string memory _userCompany
    ) private {
        User storage user = users[_userAddress];
        require(!user.set);

        users[_userAddress] = User({
            id: _userId,
            company: _userCompany,
            set: true
        });

        usersCount++;
    }

    function addRoom(string memory _name) private {
        rooms[roomsCount] = Room(roomsCount, _name);
        roomsCount++;

        emit RoomAdded(roomsCount, _name);
    }

    function addBooking(uint256 _roomId, uint256 _startDate) public {
        require(
            companyBookingsCount[users[msg.sender].company] <
                maxBookingsPerCompany
        );
        if (!_isRoomBooked(_roomId, _startDate)) {
            bookings[bookingsCount] = Booking(
                bookingsCount,
                msg.sender,
                _roomId,
                _startDate,
                false
            );
            bookingsCount++;
            companyBookingsCount[users[msg.sender].company]++;

            emit BookingAdded(bookingsCount, msg.sender, _roomId, _startDate);
            return;
        }
        emit BookingFailed(bookingsCount, msg.sender, _roomId, _startDate);
    }

    function cancelBooking(uint256 _id) public {
        require(bookings[_id].user == msg.sender);
        bookings[_id].cancelled = true;
        companyBookingsCount[users[msg.sender].company]--;
        emit BookingCancelled(_id, msg.sender);
    }

    function _isRoomBooked(uint256 _roomId, uint256 _startDate)
        private
        view
        returns (bool)
    {
        for (uint256 i = 0; i < bookingsCount; i++) {
            if (
                bookings[i].roomId == _roomId &&
                !(_isValidTime(bookings[i].startDate, _startDate))
            ) {
                return true;
            }
        }
        return false;
    }

    function _isValidTime(uint256 _bookingDate, uint256 _startDate)
        private
        pure
        returns (bool)
    {
        uint256 startBookingDate = _bookingDate;
        uint256 endBookingDate = _bookingDate + 1 hours;
        uint256 startDate = _startDate;
        uint256 endDate = _startDate + 1 hours;

        if (
            (endDate >= startBookingDate && endDate <= endBookingDate) ||
            (startDate >= startBookingDate && startDate <= endBookingDate)
        ) {
            return false;
        }
        return true;
    }

    // NOTE: Get availability for a given room and date.
    function getAvailability(uint256 _roomId, uint256 _startDate)
        public
        view
        returns (bool)
    {
        require(
            companyBookingsCount[users[msg.sender].company] <
                maxBookingsPerCompany
        );
        if (!_isRoomBooked(_roomId, _startDate)) {
            return true;
        }
        return false;
    }

    function getRoomBookings(uint256 _roomId)
        public
        view
        returns (Booking[] memory)
    {
        uint256 resultCount = 0;

        for (uint256 i = 0; i < bookingsCount; i++) {
            if (bookings[i].roomId == _roomId) {
                resultCount++;
            }
        }

        Booking[] memory result = new Booking[](resultCount);

        uint256 j;

        for (uint256 i = 0; i < bookingsCount; i++) {
            if (bookings[i].roomId == _roomId) {
                result[j] = bookings[i];
                j++;
            }
        }

        return result;
    }
}
