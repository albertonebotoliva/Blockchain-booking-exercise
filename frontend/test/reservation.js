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
                return instance.bookingsCount(0, '26/05/1980', '00:00');
            }).then(function (count) {
                assert.equal(count, 0);
            });
    });
    it("initializes with 10 fake users", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.usersCount();
            }).then(function (count) {
                assert.equal(count, 10);
            });
    });
    it("initializes with 1 fake users from CocaCola", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.users("0xB1E2cc5abb7a289060e85D156B039f9b0b81eF39");
            }).then(function (user) {
                assert.equal(user[1], "CocaCola");
            });
    });
    it("initializes with 1 fake users from PepsiCola", function () {
        return Reservation.deployed()
            .then(function (instance) {
                return instance.users("0xA559396f98ff5b9aec965934E077b79BDe0E2e16");
            }).then(function (user) {
                assert.equal(user[1], "PepsiCola");
            });
    });
    it("Add one booking", function () {
        return Reservation.deployed()
            .then(function (instance) {
                reservationInstance = instance;
                return reservationInstance.addBooking(0, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.users(accounts[0]);
            })
            .then(function (user) {
                return reservationInstance.bookingsCount(user.company, '26/05/1980', '00:00');
            })
            .then(function (count) {
                assert.equal(count, 1);
            });
    });
    it("Cancel booking", function () {
        return Reservation.deployed()
            .then(function (instance) {
                reservationInstance = instance;
                return reservationInstance.addBooking(0, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.cancelBooking(0, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.users(accounts[0]);
            })
            .then(function (user) {
                return reservationInstance.bookingsCount(user.company, '26/05/1980', '00:00');
            })
            .then(function (count) {
                assert.equal(count, 0);
            });
    });
    it("Limit to 10 bookings by company and hour", function () {
        return Reservation.deployed()
            .then(function (instance) {
                reservationInstance = instance;
                return reservationInstance.addBooking(0, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(1, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(2, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(3, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(4, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(5, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(6, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(7, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(8, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(9, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.addBooking(10, '26/05/1980', '00:00');
            })
            .then(function () {
                return reservationInstance.users(accounts[0]);
            })
            .then(function (user) {
                return reservationInstance.bookingsCount(user.company, '26/05/1980', '00:00');
            })
            .then(function (count) {
                assert.equal(count, 10);
            });
    });
    it("Get Availabilities return 24 hours", function () {
        return Reservation.deployed()
            .then(function (instance) {
                reservationInstance = instance;
                return reservationInstance.getAvailabilities(0, '26/05/1980');
            })
            .then(function (availabilities) {
                assert.equal(availabilities.length, 24);
            });
    });
});