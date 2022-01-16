# Blockchain-booking-exercise
<br>
**Business problem**

Two companies, COKE and PEPSI, are sharing an office building but as they are
competitors, they don’t trust each other. Tomorrow is COLA day (for one day), that the
two companies are celebrating. They are gathering a number of business partners in
the building. In order to optimize space utilization, they have decided to set-up a joint
booking system where any user can book one of the 20 meeting rooms available, 10
from each company (C01, C02, ..., C10 and P01, P02, ...., P10).

The booking system has the following functionalities:

●  Users can see meeting rooms availability
●  Users can book meeting rooms by the hour (first come first served)
●  Users can cancel their own reservations

<br>
This repo is containerized using docker, assuming that you have docker installed you can run it with the next command:

> docker-compose up

<br>
<br>
Proposed improvements:

Reservation.sol

* Create a kill function to dispose the contract.
* Use string concatenation contract from mainnet.
* Try to simplify to reduce gas consumption.
* Create a fallback method for the contract.

<br>
Notes:

There was a migration of the .git folder and the commit history on githubis not visible (needs a fix):

To retrieve the commits history, please use:

> git log