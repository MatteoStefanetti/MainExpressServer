# MainExpressServer

### This is the main Express server of the project.<br>

Here is a list of the things we have to implement:

- has to connect to the others servers (_JavaSpring_ and _Express_) via routes
- has to host the **_socket_** structure to provide the chat system.
- has to include the front-end section of the project

## Pages

### Homepage

It's divided in 3 rows of cards:

1. last games $\rightarrow$ Query on the most recent matches (maybe 20), data will be directly visible in the
   corresponding card
2. Clubs $\rightarrow$ Query requesting clubs that have participated in the most recent games(games), or the best
   own_position(club_games) or module of net_transfer_record
3. Top players $\rightarrow$ Query on the latest ratings sorted by highest market_value.

### Competition Page

It's divided in 3 rows:

1. National $\rightarrow$ Shows nations with competitions (has a search bar)
2. International $\rightarrow$ Shows international competition (country_name and domestic_league_code attributes are
   null)
3. A specific nation (England default) $\rightarrow$ Shows that nation's competitions

### National

Selecting a country will open a list of drop-down menus which, when displayed, show the latest games in a certain league

### International and England

Shows a list of the latest games.
