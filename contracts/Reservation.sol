pragma solidity >=0.4.22 <0.9.0;

contract Reservation {
    uint256 public maxRooms = 20;
    uint256 public maxSlots = 24;
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
        address user;
        uint256 roomId;
        string company;
        string day; // String of the selected day
        string hour; // String with the slot
        bool isBooked;
    }

    string[24] slots = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
    ];

    mapping(address => User) public users;
    uint256 public usersCount;
    mapping(uint256 => Room) public rooms;
    uint256 public roomsCount;

    // ROOM - DAY - HOUR
    mapping(uint256 => mapping(string => mapping(string => Booking)))
        public bookings;
    // COMPANY - DAY - HOUR
    mapping(string => mapping(string => mapping(string => uint256)))
        public bookingsCount;

    event RoomAdded(uint256 id, string name);
    event BookingCancelled(
        address user,
        uint256 roomId,
        string company,
        string day,
        string hour,
        bool isBooked
    );
    event BookingAdded(
        address user,
        uint256 roomId,
        string company,
        string day,
        string hour,
        bool isBooked
    );
    event BookingFailed(
        address user,
        uint256 roomId,
        string company,
        string day,
        string hour,
        bool isBooked
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
        roomsCount = 0;
        usersCount = 0;

        // NOTE: We assume that exists an external service registering users.
        createUser(0, 0xB1E2cc5abb7a289060e85D156B039f9b0b81eF39, "CocaCola");
        createUser(1, 0x781b25dda486994bEA9eAD7f9C90fFB001816944, "CocaCola");
        createUser(2, 0x95cc8b1391664bDB54d262618bbf3f89b7644551, "CocaCola");
        createUser(3, 0xDA9967309B1a83E6286fC8117fC519847e2Cc858, "CocaCola");
        createUser(4, 0x38753DF5003429CA9FF2Cc229C4dA70A639e4Ad1, "CocaCola");
        createUser(5, 0xA559396f98ff5b9aec965934E077b79BDe0E2e16, "PepsiCola");
        createUser(6, 0xa66Cac55f34C1705D6c6Ca8c8F482D019e30f2A6, "PepsiCola");
        createUser(7, 0x9A4b515B2b9362766F34126555503912C1775771, "PepsiCola");
        createUser(8, 0xF59515Fb5B4fcaad851972EB4b3Bd18fE3C17253, "PepsiCola");
        createUser(9, 0x70E1b47C4EE2353d0148De9cdDd6f797E7ec7CC6, "PepsiCola");

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

    function addBooking(
        uint256 _roomId,
        string memory _day,
        string memory _hour
    ) public {
        if (
            _isRoomAvailable(_roomId, _day, _hour) &&
            bookingsCount[users[msg.sender].company][_day][_hour] <
            maxBookingsPerCompany
        ) {
            bookings[_roomId][_day][_hour] = Booking(
                msg.sender,
                _roomId,
                users[msg.sender].company,
                _day,
                _hour,
                true
            );

            bookingsCount[users[msg.sender].company][_day][_hour]++;

            emit BookingAdded(
                msg.sender,
                _roomId,
                users[msg.sender].company,
                _day,
                _hour,
                true
            );
            return;
        }
        emit BookingFailed(
            msg.sender,
            _roomId,
            users[msg.sender].company,
            _day,
            _hour,
            false
        );
    }

    function _isRoomAvailable(
        uint256 _roomId,
        string memory _day,
        string memory _hour
    ) private view returns (bool) {
        if (bookings[_roomId][_day][_hour].isBooked) {
            return false;
        }
        return true;
    }

    function cancelBooking(
        uint256 _roomId,
        string memory _day,
        string memory _hour
    ) public {
        require(bookings[_roomId][_day][_hour].user == msg.sender);
        bookings[_roomId][_day][_hour].isBooked = false;
        bookingsCount[users[msg.sender].company][_day][_hour]--;

        emit BookingCancelled(
            msg.sender,
            _roomId,
            users[msg.sender].company,
            _day,
            _hour,
            false
        );
    }

    function getAvailabilities(uint256 _roomId, string memory _day)
        public
        view
        returns (Booking[] memory)
    {
        Booking[] memory availabilities = new Booking[](maxSlots);

        for (uint256 i = 0; i < slots.length; i++) {
            if (bookings[_roomId][_day][slots[i]].isBooked) {
                availabilities[i] = bookings[_roomId][_day][slots[i]];
            } else {
                availabilities[i] = Booking(
                    address(0),
                    _roomId,
                    "",
                    _day,
                    slots[i],
                    false
                );
            }
        }
        return availabilities;
    }
}
