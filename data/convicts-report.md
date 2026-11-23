# Condamné ou pas condamné : rapport de validation

Généré par `scripts/update-convicts.mjs`. Liste source : `data/convicts-source.json` (à modifier à la main).

- Entrées dans la liste source : 139
- Gardées dans le jeu : 138 (78 condamnées, 60 non condamnées)
- Écartées : 1

Drapeaux : `sensible` = affaire délicate (mœurs, violences, présomption d'innocence) à relire ; `evolutif` = procédure qui peut encore bouger ; `verifier` = fait à confirmer ; `annule` = condamnation annulée, la bonne réponse est « pas condamné ».

## Écartées (à corriger dans la liste source)

| Personne | Réponse | Validation | Wikidata (P1399) | Drapeaux |
|---|---|---|---|---|
| Xavier Niel | Condamné | Non confirmé : ni Wikidata ni Wikipédia FR ne mentionnent de condamnation | — | verifier |

## Cas sensibles gardés (à relire)

| Personne | Réponse | Validation | Wikidata (P1399) | Drapeaux |
|---|---|---|---|---|
| Georges Tron | Condamné | Confirmé par Wikidata | viol (2021) ; agression sexuelle (2021) | sensible |
| Patrick Poivre d'Arvor | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | sensible |
| Gérard Depardieu | Condamné | Confirmé par Wikidata | agression sexuelle (2025) | sensible, verifier |
| Roman Polanski | Condamné | Confirmé par Wikidata | atteinte sexuelle sur mineur [sans source] | sensible |
| Bertrand Cantat | Condamné | Confirmé par Wikidata | violences volontaires ayant entraîné la mort sans l'intention de la donner (2004) | sensible |
| Mike Tyson | Condamné | Confirmé par Wikidata | viol (1992) ; voie de fait (1998) | sensible |
| Oscar Pistorius | Condamné | Confirmé par Wikidata | homicide volontaire (2014) | sensible |
| Chris Brown | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | sensible |
| Jeffrey Epstein | Condamné | Confirmé par Wikidata | trafic sexuel (2008) | sensible |
| Ghislaine Maxwell | Condamné | Confirmé par Wikidata | trafic d'enfants (2021) ; association de malfaiteurs (2021) | sensible |
| Dominique Strauss-Kahn | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Gérald Darmanin | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Nicolas Hulot | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Luc Besson | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Franck Ribéry | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Bill Cosby | Pas condamné | Condamnation annulée (Wikidata la mentionne encore) | aggravated indecent assault (2018) | annule, sensible |
| Michael Jackson | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Kevin Spacey | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Woody Allen | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |

## Procédures évolutives et faits à vérifier

| Personne | Réponse | Validation | Wikidata (P1399) | Drapeaux |
|---|---|---|---|---|
| Jair Bolsonaro | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | evolutif |
| Éric Woerth | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Carlos Ghosn | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Vladimir Poutine | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Benjamin Netanyahou | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Bachar el-Assad | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Thomas Thévenoud | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | verifier |
| Gérard Depardieu | Condamné | Confirmé par Wikidata | agression sexuelle (2025) | sensible, verifier |
| Karim Benzema | Condamné | Confirmé par Wikidata | extorsion | verifier |
| Cyril Hanouna | Pas condamné | Aucune condamnation dans Wikidata | — | verifier |
| Orelsan | Pas condamné | Aucune condamnation dans Wikidata | — | verifier |
| Guy Bedos | Pas condamné | Aucune condamnation dans Wikidata | — | verifier |

## Suggestions : personnes très connues que Wikidata dit condamnées, absentes de la liste

- [Jésus-Christ](https://www.wikidata.org/wiki/Q302) (347 wikis)
- [Donald Trump](https://www.wikidata.org/wiki/Q22686) (338 wikis)
- [Lénine](https://www.wikidata.org/wiki/Q1394) (297 wikis)
- [Léon Tolstoï](https://www.wikidata.org/wiki/Q7243) (282 wikis)
- [Galilée](https://www.wikidata.org/wiki/Q307) (271 wikis)
- [Alan Turing](https://www.wikidata.org/wiki/Q7251) (193 wikis)
- [Diego Maradona](https://www.wikidata.org/wiki/Q17515) (176 wikis)
- [Giordano Bruno](https://www.wikidata.org/wiki/Q36330) (151 wikis)
- [Benazir Bhutto](https://www.wikidata.org/wiki/Q34413) (150 wikis)
- [Nicolás Maduro](https://www.wikidata.org/wiki/Q58132) (141 wikis)
- [Ferdinand E. E. Marcos](https://www.wikidata.org/wiki/Q1463) (138 wikis)
- [Hosni Moubarak](https://www.wikidata.org/wiki/Q34105) (137 wikis)
- [Tupac Shakur](https://www.wikidata.org/wiki/Q6107) (136 wikis)
- [Maximilien de Robespierre](https://www.wikidata.org/wiki/Q44197) (133 wikis)
- [Sophia Loren](https://www.wikidata.org/wiki/Q43252) (133 wikis)
- [Pol Pot](https://www.wikidata.org/wiki/Q39464) (132 wikis)
- [Soekarno](https://www.wikidata.org/wiki/Q76127) (129 wikis)
- [Emma Goldman](https://www.wikidata.org/wiki/Q79969) (128 wikis)
- [Russell Crowe](https://www.wikidata.org/wiki/Q129817) (125 wikis)
- [Mikheil Saakachvili](https://www.wikidata.org/wiki/Q43330) (121 wikis)
- [Cristina Fernández de Kirchner](https://www.wikidata.org/wiki/Q40649) (120 wikis)
- [Augusto Pinochet](https://www.wikidata.org/wiki/Q368) (120 wikis)
- [Ariel Sharon](https://www.wikidata.org/wiki/Q60206) (119 wikis)
- [Viktor Ianoukovytch](https://www.wikidata.org/wiki/Q1459658) (119 wikis)
- [Marine Le Pen](https://www.wikidata.org/wiki/Q12927) (118 wikis)
- [Pervez Musharraf](https://www.wikidata.org/wiki/Q40495) (117 wikis)
- [Liu Xiaobo](https://www.wikidata.org/wiki/Q41617) (117 wikis)
- [Sheikh Hasina](https://www.wikidata.org/wiki/Q52183) (114 wikis)
- [Q48259](https://www.wikidata.org/wiki/Q48259) (113 wikis)
- [Paris Hilton](https://www.wikidata.org/wiki/Q47899) (112 wikis)
- [Hermann Göring](https://www.wikidata.org/wiki/Q47906) (111 wikis)
- [Pablo Escobar](https://www.wikidata.org/wiki/Q187447) (110 wikis)
- [Gotthold Ephraim Lessing](https://www.wikidata.org/wiki/Q34628) (108 wikis)
- [Jan Hus](https://www.wikidata.org/wiki/Q43977) (106 wikis)
- [Park Geun-hye](https://www.wikidata.org/wiki/Q138048) (106 wikis)
- [George Soros](https://www.wikidata.org/wiki/Q12908) (105 wikis)
- [Jacob Zuma](https://www.wikidata.org/wiki/Q57282) (104 wikis)
- [Imelda Marcos](https://www.wikidata.org/wiki/Q285536) (103 wikis)
- [James Brown](https://www.wikidata.org/wiki/Q5950) (100 wikis)
- [Gavrilo Princip](https://www.wikidata.org/wiki/Q80492) (99 wikis)
- [Mark Wahlberg](https://www.wikidata.org/wiki/Q164119) (99 wikis)
- [Chuck Berry](https://www.wikidata.org/wiki/Q5921) (99 wikis)
- [Guillaume d'Ockham](https://www.wikidata.org/wiki/Q43936) (98 wikis)
- [O. Henry](https://www.wikidata.org/wiki/Q172788) (96 wikis)
- [Charles Manson](https://www.wikidata.org/wiki/Q485508) (95 wikis)
- [Kim Dae-jung](https://www.wikidata.org/wiki/Q45785) (95 wikis)
- [Daniel Ortega](https://www.wikidata.org/wiki/Q57402) (95 wikis)
- [Adolf Eichmann](https://www.wikidata.org/wiki/Q28085) (94 wikis)
- [Omar el-Béchir](https://www.wikidata.org/wiki/Q57265) (94 wikis)
- [Dr. Dre](https://www.wikidata.org/wiki/Q6078) (94 wikis)
- [Zulfikar Alî Bhutto](https://www.wikidata.org/wiki/Q131355) (93 wikis)
- [Radovan Karadžić](https://www.wikidata.org/wiki/Q123923) (92 wikis)
- [Asif Ali Zardari](https://www.wikidata.org/wiki/Q57373) (92 wikis)
- [José Rizal](https://www.wikidata.org/wiki/Q1500) (91 wikis)
- [Mata Hari](https://www.wikidata.org/wiki/Q82180) (91 wikis)
- [Yoon Suk-yeol](https://www.wikidata.org/wiki/Q16090635) (91 wikis)
- [R. Kelly](https://www.wikidata.org/wiki/Q273055) (90 wikis)
- [Anders Behring Breivik](https://www.wikidata.org/wiki/Q44220) (89 wikis)
- [Evgueni Prigojine](https://www.wikidata.org/wiki/Q20850503) (89 wikis)
- [Hideki Tōjō](https://www.wikidata.org/wiki/Q160847) (89 wikis)

## Toutes les entrées gardées

| Personne | Réponse | Validation | Wikidata (P1399) | Drapeaux |
|---|---|---|---|---|
| Nicolas Sarkozy | Condamné | Confirmé par Wikidata | financement illégal de campagne électorale (2021) ; corruption et trafic d'influence (2023) ; association de malfaiteurs (2025) |  |
| Jacques Chirac | Condamné | Confirmé par Wikidata | détournement de fonds (2009) [sans source] |  |
| Alain Juppé | Condamné | Confirmé par Wikidata | prise illégale d'intérêts (2004) |  |
| François Fillon | Condamné | Confirmé par Wikidata | détournement de fonds publics (2025) |  |
| Jérôme Cahuzac | Condamné | Confirmé par Wikidata | fraude fiscale (2018) |  |
| Patrick Balkany | Condamné | Confirmé par Wikidata | prise illégale d'intérêts (1996) |  |
| Isabelle Balkany | Condamné | Confirmé par Wikidata | détournement de fonds (2020) |  |
| Bernard Tapie | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Jean-Marie Le Pen | Condamné | Confirmé par Wikidata | voie de fait (1998) ; incitation à la haine raciale (2005) |  |
| Éric Zemmour | Condamné | Confirmé par Wikidata | incitation à la haine raciale (2022) ; incitation à la haine raciale (2018) ; incitation à la haine raciale (2011) ; injure (2024) ; injure (2024) ; incitation à la haine raciale (2024) |  |
| Alain Carignon | Condamné | Confirmé par Wikidata | abus de biens sociaux (1996) ; subornation de témoin (1996) ; corruption (1996) ; abus de biens sociaux (1999) ; faux (1999) |  |
| Henri Emmanuelli | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Claude Guéant | Condamné | Confirmé par Wikidata | détournement de fonds (2017) ; favoritisme (2022) |  |
| Charles Pasqua | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Georges Tron | Condamné | Confirmé par Wikidata | viol (2021) ; agression sexuelle (2021) | sensible |
| Jean-Luc Mélenchon | Condamné | Confirmé par Wikidata | rébellion (2019) ; diffamation (2022) |  |
| Christine Boutin | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Thomas Thévenoud | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | verifier |
| José Bové | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Jérôme Kerviel | Condamné | Confirmé par Wikidata | fraude électronique |  |
| François-Marie Banier | Condamné | Confirmé par Wikidata | abus de faiblesse (2016) |  |
| Patrick Poivre d'Arvor | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | sensible |
| Gérard Depardieu | Condamné | Confirmé par Wikidata | agression sexuelle (2025) | sensible, verifier |
| Roman Polanski | Condamné | Confirmé par Wikidata | atteinte sexuelle sur mineur [sans source] | sensible |
| Bertrand Cantat | Condamné | Confirmé par Wikidata | violences volontaires ayant entraîné la mort sans l'intention de la donner (2004) | sensible |
| Joeystarr | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Samy Naceri | Condamné | Confirmé par Wikidata | tentative de meurtre |  |
| Nabilla Benattia | Condamné | Confirmé par Wikidata | violences volontaires (2015) ; publicité mensongère (2021) |  |
| Brigitte Bardot | Condamné | Confirmé par Wikidata | incitation à la haine raciale (2018) ; incitation à la haine raciale (2004) ; incitation à la haine raciale (1998) |  |
| Dieudonné | Condamné | Confirmé par Wikidata | fraude |  |
| Alain Soral | Condamné | Confirmé par Wikidata | fraude fiscale [sans source] ; incitation à la haine raciale ; diffamation ; Apologie de crime de guerre [sans source] |  |
| Karim Benzema | Condamné | Confirmé par Wikidata | extorsion | verifier |
| Éric Cantona | Condamné | Confirmé par Wikidata | voie de fait |  |
| Lionel Messi | Condamné | Confirmé par Wikidata | fraude fiscale (2016) |  |
| Cristiano Ronaldo | Condamné | Confirmé par Wikidata | évasion fiscale |  |
| Boris Becker | Condamné | Confirmé par Wikidata | évasion fiscale (2002) |  |
| Mike Tyson | Condamné | Confirmé par Wikidata | viol (1992) ; voie de fait (1998) | sensible |
| O. J. Simpson | Condamné | Confirmé par Wikidata | vol avec violence (2008) |  |
| Oscar Pistorius | Condamné | Confirmé par Wikidata | homicide volontaire (2014) | sensible |
| Shakira | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Robert Downey Jr. | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Mel Gibson | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Winona Ryder | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Sean Penn | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Naomi Campbell | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Pete Doherty | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Chris Brown | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | sensible |
| Jeffrey Epstein | Condamné | Confirmé par Wikidata | trafic sexuel (2008) | sensible |
| Ghislaine Maxwell | Condamné | Confirmé par Wikidata | trafic d'enfants (2021) ; association de malfaiteurs (2021) | sensible |
| Bernard Madoff | Condamné | Confirmé par Wikidata | chaîne de Ponzi (2009) ; fraude boursière [sans source] ; fraude par voie postale et électronique [sans source] ; blanchiment d'argent [sans source] ; fausses déclarations [sans source] ; parjure [sans source] |  |
| Jordan Belfort | Condamné | Confirmé par Wikidata | fraude (1999) ; blanchiment d'argent (1999) |  |
| Julian Assange | Condamné | Confirmé par Wikidata | défaut de comparution (2019) ; cybercrime (1996) ; conspiracy to commit espionage (2024) |  |
| Chelsea Manning | Condamné | Confirmé par Wikidata | espionnage (2013) ; outrage au tribunal (2019) |  |
| Silvio Berlusconi | Condamné | Confirmé par Wikidata | accounting fraud (2013) ; perjury (1990) ; accounting fraud (1999) ; fraude fiscale (2013) ; détournement de fonds (2013) ; illegal party financing (2000) |  |
| Recep Tayyip Erdoğan | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Alexeï Navalny | Condamné | Confirmé par Wikidata | détournement de fonds (2013) ; fraude (2014) ; extrémisme (2023) |  |
| Jair Bolsonaro | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — | evolutif |
| Alberto Fujimori | Condamné | Confirmé par Wikidata | meurtre (2009) ; crime contre l'humanité (2009) ; enlèvement (2009) ; détournement de fonds [sans source] ; soudoiement ; péculat [sans source] ; Usurpation of public functions (2017) |  |
| Saddam Hussein | Condamné | Confirmé par Wikidata | nettoyage ethnique [sans source] ; crime contre l'humanité (2006) |  |
| Nicolae Ceaușescu | Condamné | Confirmé par Wikidata | abus de pouvoir (1989) [sans source] ; génocide (1989) [sans source] ; détournement de fonds (1989) [sans source] |  |
| Nelson Mandela | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Mohandas Karamchand Gandhi | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Malcolm X | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| George W. Bush | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Adolf Hitler | Condamné | Confirmé par Wikidata | haute trahison [sans source] |  |
| Philippe Pétain | Condamné | Confirmé par Wikidata | haute trahison (1945) |  |
| Maurice Papon | Condamné | Confirmé par Wikidata | meurtre [sans source] ; crime contre l'humanité (1998) |  |
| Klaus Barbie | Condamné | Confirmé par Wikidata | crime contre l'humanité |  |
| Al Capone | Condamné | Confirmé par Wikidata | fraude fiscale (1931) |  |
| Joaquín Guzmán Loera | Condamné | Confirmé par Wikidata | meurtre [sans source] ; blanchiment d'argent [sans source] ; trafic de stupéfiants [sans source] ; racket [sans source] ; crime organisé [sans source] |  |
| Louis XVI | Condamné | Confirmé par Wikidata | trahison |  |
| Marie-Antoinette | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Georges Jacques Danton | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Paul Verlaine | Condamné | Confirmé par Wikidata | sodomie |  |
| Oscar Wilde | Condamné | Confirmé par Wikidata | grossière indécence (1895) |  |
| Marquis de Sade | Condamné | Confirmé par Wikidata | sodomie |  |
| Jean Genet | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Socrate | Condamné | Confirmé par Wikipédia FR (absent de Wikidata) | — |  |
| Dominique Strauss-Kahn | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Édouard Balladur | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Laurent Fabius | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Dominique de Villepin | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Éric Dupond-Moretti | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Richard Ferrand | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Éric Woerth | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Jean-François Copé | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Gérald Darmanin | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Nicolas Hulot | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| François Mitterrand | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Carlos Ghosn | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Alain Delon | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Michel Houellebecq | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Cyril Hanouna | Pas condamné | Aucune condamnation dans Wikidata | — | verifier |
| Luc Besson | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Orelsan | Pas condamné | Aucune condamnation dans Wikidata | — | verifier |
| Guy Bedos | Pas condamné | Aucune condamnation dans Wikidata | — | verifier |
| Franck Ribéry | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Richard Virenque | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Michel Platini | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Paul Pogba | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Zinedine Zidane | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Nasser Al-Khelaïfi | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Sacha Guitry | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Coco Chanel | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Gustave Flaubert | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Napoléon Ier | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Alfred Dreyfus | Pas condamné | Aucune condamnation dans Wikidata | — | annule |
| Jeanne d'Arc | Pas condamné | Condamnation annulée (Wikidata la mentionne encore) | hérésie (1431) | annule |
| Charles Baudelaire | Pas condamné | Aucune condamnation dans Wikidata | — | annule |
| Mohamed Ali | Pas condamné | Aucune condamnation dans Wikidata | — | annule |
| Bill Cosby | Pas condamné | Condamnation annulée (Wikidata la mentionne encore) | aggravated indecent assault (2018) | annule, sensible |
| Luiz Inácio Lula da Silva | Pas condamné | Aucune condamnation dans Wikidata | — | annule |
| Michael Jackson | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Kevin Spacey | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Woody Allen | Pas condamné | Aucune condamnation dans Wikidata | — | sensible |
| Charlie Chaplin | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Lance Armstrong | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Sepp Blatter | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Neymar | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Will Smith | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Kate Moss | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Bill Clinton | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Richard Nixon | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Hillary Clinton | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Lee Harvey Oswald | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Elon Musk | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Bill Gates | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Mark Zuckerberg | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Rupert Murdoch | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Edward Snowden | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Vladimir Poutine | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Benjamin Netanyahou | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Bachar el-Assad | Pas condamné | Aucune condamnation dans Wikidata | — | evolutif |
| Slobodan Milošević | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Mouammar Kadhafi | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Oussama ben Laden | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Benito Mussolini | Pas condamné | Aucune condamnation dans Wikidata | — |  |
| Che Guevara | Pas condamné | Aucune condamnation dans Wikidata | — |  |
