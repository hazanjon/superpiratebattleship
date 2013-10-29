# Super Pirate Battleship

An awesome game made by Curt, Jake and Jon at Hackfrence 2013.

Make sure you push all changed back here, and keep a track of all commits here plz :)

## Versions

- Version 0.1 - Initial

Basic Game version

## Installation

# Requirements

- PHP5.3
  - Curl
- Mysql
- Composer
- Twilio API Key
- Pusher API Key
- Soundcloud API Key

Setup the codebase:
```
git clone https://github.com/hazanjon/superpiratebattleship.git superpiratebattleship.com
cd superpiratebattleship.com
composer install
cp config/config.example.php config/config.php
```

Setup the database
```
mysql -u <username> -p
CREATE DATABASE spb;
CREATE USER 'pirate'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON spb.* TO 'pirate'@'localhost';
USE spb;
SOURCE spb.sql
```

Use your favourite editor to add your API keys / Mysql details to config/config.php
