CREATE DATABASE socka;
USE DATABASE socka;
CREATE TABLE IF NOT EXISTS `players` (
    `id` int(5) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `position` varchar(255) NOT NULL,
    `number` int(11) NOT NULL,
    `image` varchar(255) NOT NULL,
    `user_name` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

INSERT INTO `players` (`first_name`, `last_name`, `position`, `number`, `image`, `user_name`) VALUES
('Lionel', 'Messi', 'Delantero', 10, 'messi.jpg', 'lmessi'),
('Cristiano', 'Ronaldo', 'Delantero', 7, 'ronaldo.jpg', 'cronaldo'),
('Neymar', 'Jr', 'Delantero', 11, 'neymar.jpg', 'neymarjr'),
('Kevin', 'De Bruyne', 'Mediocampista', 17, 'debruyne.jpg', 'kdb'),
('Virgil', 'van Dijk', 'Defensa', 4, 'vandijk.jpg', 'virgilvd'),
('Manuel', 'Neuer', 'Portero', 1, 'neuer.jpg', 'mneuer'),
('Kylian', 'Mbappé', 'Delantero', 7, 'mbappe.jpg', 'kmbappe'),
('Luka', 'Modric', 'Mediocampista', 10, 'modric.jpg', 'lmodric'),
('Sergio', 'Ramos', 'Defensa', 4, 'ramos.jpg', 'sramos'),
('Robert', 'Lewandowski', 'Delantero', 9, 'lewandowski.jpg', 'rlewandowski');