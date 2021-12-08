var Reservation = artifacts.require("./Reservation.sol");

contract("Reservation", function (accounts) {
    it("initializes with 20 rooms", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.roomsCount();
            }).then(function (count) {
                assert.equal(count, 20);
            });
    });
    it("initializes with 0 bookings", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.bookingsCount();
            }).then(function (count) {
                assert.equal(count, 0);
            });
    });
    it("initializes with 2 fake users", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.usersCount();
            }).then(function (count) {
                assert.equal(count, 2);
            });
    });
    it("initializes with 1 fake users from CocaCola", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.users("0x2cDB90d0F33FDE3c8802B021452cCfe5e1d25574");
            }).then(function (user) {
                assert.equal(user[1], "CocaCola");
            });
    });
    it("initializes with 1 fake users from PepsiCola", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.users("0xa4387a7E4e854DA0c83ADCC9514eBe581DCe85D4");
            }).then(function (user) {
                assert.equal(user[1], "PepsiCola");
            });
    });
    it("Add one booking", function () {
        return Reservation.deployed()
            .then(function (instance) {
                reservationInstance = instance;
                return reservationInstance.addBooking(0, 1638976199);
            })
            .then(function (booking) {
                return reservationInstance.bookingsCount();
            })
            .then(function (count) {
                assert.equal(count, 1);
            });
    });
    it("Add only one booking if timestamp difference < 1 hour", function () {
        return Reservation.deployed()
            .then(function (instance) {
                reservationInstance = instance;
                return reservationInstance.addBooking(0, 1638976199);
            })
            .then(function (booking) {
                return reservationInstance.addBooking(0, 1638976200);
            })
            .then(function (booking) {
                return reservationInstance.bookingsCount();
            })
            .then(function (count) {
                assert.equal(count, 1);
            });
    });
    it("Cancel booking", function () {
        return Reservation.deployed()
            .then(function (instance) {
                reservationInstance = instance;
                return reservationInstance.addBooking(0, 1638976199);
            })
            .then(function (instance) {
                return reservationInstance.cancelBooking(0);
            })
            .then(function (booking) {
                return reservationInstance.bookingsCount();
            })
            .then(function (count) {
                assert.equal(count, 1);
            });
    });

});