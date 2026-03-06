"use strict";
goog.provide("Blockly.Msg.fr");
goog.require("Blockly.Msg");

Blockly.Msg.INOUT_HIGH_LEVEL = "1 (HIGH Zustand)";
Blockly.Msg.INOUT_LOW_LEVEL = "0 (LOW Zustand)";
Blockly.Msg.ARD_TYPE_CHAR = "Zeichen";
Blockly.Msg.ARD_TYPE_TEXT = "Text";
Blockly.Msg.ARD_TYPE_BOOL = "Boolean";
Blockly.Msg.ARD_TYPE_SHORT = "Byte";
Blockly.Msg.ARD_TYPE_NUMBER = "Ganzzahl";
Blockly.Msg.ARD_TYPE_UNUMBER = "vorzeichenlose Ganzzahl";
Blockly.Msg.ARD_TYPE_LONG = "lange Ganzzahl";
Blockly.Msg.ARD_TYPE_DECIMAL = "Fließkommazahl";
Blockly.Msg.ARD_TYPE_ARRAY = "Feld";
Blockly.Msg.ARD_TYPE_NULL = "leer";
Blockly.Msg.ARD_TYPE_UNDEF = "nicht definiert";
Blockly.Msg.ARD_TYPE_VOLATILE = "flüchtige Ganzzahl";
Blockly.Msg.ARD_TYPE_CHILDBLOCKMISSING = "Eingabe fehlt in einem Block";
Blockly.Msg.ARDUINO_BETWEEN = "zufällige Nummer zwischen";
Blockly.Msg.ARDUINO_BETWEEN_AND = "und";
Blockly.Msg.ARDUINO_VAR_DECLARE = "Zustände";
Blockly.Msg.ARDUINO_VAR_AS = "als";
Blockly.Msg.ARDUINO_VAR_VAL = "von Wert";
Blockly.Msg.base_def_const = "setze";
Blockly.Msg.base_define_const = "welches gleich ist mit";
Blockly.Msg.base_define_const_tooltip =
  "erlaubt dem Programmiere jedem Wert einen Namen zu geben";
Blockly.Msg.type = "setze einen Wert als den ausgewählten Typ";
Blockly.Msg.ADD_COMMENT = "Füge einen Kommentar hinzu";
Blockly.Msg.CHANGE_VALUE_TITLE = "Ändere Wert:";
Blockly.Msg.CLEAN_UP = "Lösche Blöcke";
Blockly.Msg.COLLAPSE_ALL = "Reduziere Blöcke";
Blockly.Msg.COLLAPSE_BLOCK = "Reduziere Blöcke";
Blockly.Msg.CONTROLS_SWITCH_VAR_TITLE = "Während";
Blockly.Msg.CONTROLS_SWITCH_MSG_DEFAULT = "standard";
Blockly.Msg.CONTROLS_SWITCH_MSG_CASEBREAK = "ist";
Blockly.Msg.CONTROLS_SWITCH_MSG_SWITCHVAR = "falls die Variable gültig ist";
Blockly.Msg.CONTROLS_SWITCH_MSG_DO = "mache";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_1 =
  "Falls ein Wert wahr ist, dann führe die folgenden Befehle aus";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_2 =
  "Falls ein Wert wahr ist, dann führe den ersten Block mit Befehlen aus, ansonsten führe den nächsten Block mit Befehlen aus";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_3 =
  "Falls ein Wert wahr ist, dann führe den ersten Block mit Befehlen aus, ansonsten führe den nächsten Block mit Befehlen aus, falls dieser Zustand wahr ist";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_4 =
  "Falls ein Wert wahr ist, dann führe den ersten Block mit Befehlen aus, ansonsten führe den nächsten Block mit Befehlen aus, falls dieser Zustand wahr ist. Falls keine Bedingung erfüllt ist, dann führe den Standardkommandoblock aus.";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK = "verlasse die Schleife";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE =
  "wechsle zur nächsten Iteration";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK = "Verlasse diese Schleife";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE =
  "Überspringe den Rest dieser Schleife und fahre mit der nächsten Iteration fort";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING =
  "Warnung: Dieser Block muss in einer Schleife benutzt werden";
Blockly.Msg.CONTROLS_FOREACH_TITLE = "für jedes Element %1 in der Liste %2";
Blockly.Msg.CONTROLS_FOREACH_TOOLTIP =
  "Weisen Sie für jedes Element in einer Liste den Wert des Elements der Variablen %1 zu und führe dann die Anweisungen aus";
Blockly.Msg.CONTROLS_FOR_TITLE = "für %1 im Bereich von %2 bis %3 in %4 er-Schritten";
Blockly.Msg.CONTROLS_FOR_TITLE2 =
  "für %1 im Bereich von %2 to %3 (>=) in %4 er-Schritten";
Blockly.Msg.CONTROLS_FOR_TOOLTIP =
  "Setze Variable %1 auf Werte von der Startnummer bis zur Endnummer, mit angegebener Schrittgröße, und führe die vorgegebenen Anweisungen aus";
Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP = "Bedingung hinzufügen";
Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP = "eine letzte Bedingung hinzufügen";
Blockly.Msg.CONTROLS_IF_IF_TOOLTIP = "Hinzufügen, löschen oder neuordnen";
Blockly.Msg.CONTROLS_IF_MSG_ELSE = "sonst";
Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = "falls nicht";
Blockly.Msg.CONTROLS_IF_MSG_IF = "falls";
Blockly.Msg.CONTROLS_IF_TOOLTIP_1 =
  "Falls ein Wert wahr ist, dann führe die Befehle aus";
Blockly.Msg.CONTROLS_IF_TOOLTIP_2 =
  "Falls ein Wert wahr ist, dann führe den ersten Block mit Befehlen aus, andererseits führe den zweiten Block mit Befehlen aus";
Blockly.Msg.CONTROLS_IF_TOOLTIP_3 =
  "Falls ein Wert wahr ist, dann führe den ersten Block mit Befehlen aus, andererseits, falls der zweite Wert wahr ist, führe den zweiten Block mit Befehlen aus";
Blockly.Msg.CONTROLS_IF_TOOLTIP_4 =
  "Falls ein Wert wahr ist, dann führe den ersten Block mit Befehlen aus, andererseits, falls der zweite Wert wahr ist, führe den zweiten Block mit Befehlen aus. Falls keiner der Werte wahr ist, führe den letzten Block mit Befehlen aus";
Blockly.Msg.CONTROLS_REPEAT_INPUT_DO = "mache";
Blockly.Msg.CONTROLS_REPEAT_TITLE = "🔁 wiederhole %1 mal";
Blockly.Msg.CONTROLS_REPEAT_TOOLTIP = "Führe Befehle mehrfach aus";
Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL = "wiederhole";
Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE = "wiederhole so lange wie";
Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL =
  "So lange wie ein Wert falsch ist, führe die Anweisungen aus";
Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE =
  "So lange wie ein Wert wahr ist, führe die Anweisungen aus";
Blockly.Msg.DELETE_ALL_BLOCKS = "Lösche diese %1 Blöcke?";
Blockly.Msg.DELETE_BLOCK = "Lösche den Block";
Blockly.Msg.DELETE_VARIABLE = "Lösche die Variable %1";
Blockly.Msg.DELETE_VARIABLE_CONFIRMATION = "Lösche %1 Aufrufe von Variable %2?";
Blockly.Msg.DELETE_X_BLOCKS = "Lösche %1 Blöcke";
Blockly.Msg.DISABLE_BLOCK = "Deaktiviere Block";
Blockly.Msg.DUPLICATE_BLOCK = "Dupliiziere";
Blockly.Msg.ENABLE_BLOCK = "Aktiviere Block";
Blockly.Msg.EXPAND_ALL = "Erweitere Blöcke";
Blockly.Msg.EXPAND_BLOCK = "Erweitere Block";
Blockly.Msg.EXTERNAL_INPUTS = "Externe Eingaben";
Blockly.Msg.HELP = "Hilfe";
Blockly.Msg.INLINE_INPUTS = "Onlineeinträge";
Blockly.Msg.LISTS_CREATE1 = "erstelle eine Liste";
Blockly.Msg.LISTS_CREATE2 = "mit";
Blockly.Msg.LISTS_CREATE_TOOLTIP =
  "Erstelle eine Liste mit der gewünschten Anzahl von Elementen";
Blockly.Msg.LISTS_append = "füge %1 am Ende von %2 hinzu";
Blockly.Msg.LISTS_append_TOOLTIP = "füge ein Element am Ende der Liste hinzu";
Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Liste";
Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP = "Hinzufügen, löschen, oder neuordnen";
Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = "erstelle eine Liste mit";
Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP = "Füge ein Element hinzu";
Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP =
  "gibt ein Feld oder eine Liste mit jeder Anzahl von Elementen zurück";
Blockly.Msg.LISTS_GET = "das Element";
Blockly.Msg.LISTS_GET_INDEX_FROM_END = "# seit dem Ende";
Blockly.Msg.LISTS_GET_INDEX_FROM_START = "#"; // untranslated
Blockly.Msg.LISTS_GET_INDEX_GET = "Erhalte";
Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE = "erhalte und lösche";
Blockly.Msg.LISTS_GET_INDEX_LAST = "letztes";
Blockly.Msg.LISTS_GET_INDEX_RANDOM = "zufällig";
Blockly.Msg.LISTS_GET_INDEX_REMOVE = "lösche";
Blockly.Msg.LISTS_GET_INDEX_TAIL = ""; // untranslated
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST =
  "gibt erstes Element der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM =
  "gibt Element an bestimmter Stelle der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST =
  "gibt letztes Element der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM =
  "gibt zufälliges Element der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST =
  "Löscht ung gibt erstes Element der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM =
  "Löscht ung gibt Element an der ausgewählten Stelle der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST =
  "Löscht ung gibt letztes Element der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM =
  "Löscht ung gibt zufälliges Element der Liste zurück";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST =
  "Löscht erstes Element der Liste";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM =
  "Löscht Element an der angegebenen Stelle aus der Liste";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST =
  "Löscht letztes Element der Liste";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM =
  "Löscht zufälliges Element der Liste";
Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END = "bis # seit dem Ende";
Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START = "bis zu #";
Blockly.Msg.LISTS_GET_SUBLIST_END_LAST = "bis zum Ende";
Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST =
  "erhalte die Teilliste ab Beginn";
Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END =
  "erhalte die Teilliste ab # seit dem Ende";
Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START = "erhalte die Teilliste ab #";
Blockly.Msg.LISTS_GET_SUBLIST_TAIL = ""; // untranslated
Blockly.Msg.LISTS_GET_SUBLIST_TOOLTIP =
  "Erstellt eine Kopie des ausgewählten Teils einer Liste";
Blockly.Msg.LISTS_INDEX_FROM_END_TOOLTIP = "%1 ist das letzte Element";
Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP = "%1 ist das erste Element";
Blockly.Msg.LISTS_INDEX_OF_FIRST = "finde die erste Erscheinung des Elements";
Blockly.Msg.LISTS_INDEX_OF_LAST = "finde die letzte Erscheinung des Elements";
Blockly.Msg.LISTS_INDEX_OF_TOOLTIP =
  "gibt den Index der ersten/letzten Erscheinung eines Elemets in der Liste zurück,  gibt %1 zurück, falls das Element nicht gefunden wurde";
Blockly.Msg.LISTS_INLIST = "in der Liste";
Blockly.Msg.LISTS_ISEMPTY_TITLE = "%1 ist leer";
Blockly.Msg.LISTS_ISEMPTY_TOOLTIP = "gibt wahr zurück, wenn Liste leer ist";
Blockly.Msg.LISTS_LENGTH_TITLE = "Länge von%1";
Blockly.Msg.LISTS_LENGTH_TOOLTIP = "gibt die Länge einer Liste zurück";
Blockly.Msg.LISTS_REPEAT_TITLE =
  "erstelle eine Liste mit dem Element %1, welches %2 mal vorkommen soll";
Blockly.Msg.LISTS_REPEAT_TOOLTIP =
  "erstelle eine Liste bestehend aus dem gelieferten Wert, der die angegebene Anzahl von Malen wiederholt wird";
Blockly.Msg.LISTS_SET_INDEX_INPUT_TO = "wie";
Blockly.Msg.LISTS_of = "von";
Blockly.Msg.LISTS_SET_INDEX_SET = "setze das Element";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST =
  "fügt das Element am Anfang einer Liste ein";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM =
  "fügt das Element an der angegebenen Stelle einer Liste ein";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST =
  "fügt das Element am Ende einer Liste ein";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM =
  "fügt das Element an einer zufälligen Stelle einer Liste ein";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST = "repariere das erste Element in einer Liste";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM =
  "aktualisiere das Element an der angegebenen Position in einer Liste";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST = "repariere das letzte Element in einer Liste";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM =
  "repariere ein zufälliges Element in einer Liste";
Blockly.Msg.LOGIC_BOOLEAN_FALSE = "falsch";
Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP = "gibt einen logischen 0 oder 1 Zustand zurück";
Blockly.Msg.LOGIC_BOOLEAN_TRUE = "wahr";
Blockly.Msg.compare = "gibt wahr zurück, falls ein Wert in einem Intervall vorkommt";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ = "gibt wahr zurück, falls beide Werte gleich sind";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT =
  "gibt wahr zurück, falls der erste Wert größer als der zweite Wert ist";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE =
  "gibt wahr zurück, falls der erste Wert größer oder gleich als der zweite Wert ist";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT =
  "gibt wahr zurück, falls der erste Wert kleiner als der zweite Wert ist";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE =
  "gibt wahr zurück, falls der erste Wert kleiner oder gleich als der zweite Wert ist";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ =
  "gibt wahr zurück, falls die beiden Werte ungleich sind";
Blockly.Msg.LOGIC_NEGATE_TITLE = "nicht %1";
Blockly.Msg.LOGIC_NEGATE_TOOLTIP =
  "gibt wahr zurück, falls der Wert falsch ist, gibt falsch zurück, falls der Wert wahr ist";
Blockly.Msg.LOGIC_NULL = "null";
Blockly.Msg.LOGIC_NULL_TOOLTIP = "gibt null zurück";
Blockly.Msg.LOGIC_OPERATOR = [
  ["und", "and"],
  ["oderr", "or"],
  ["exklusives oder", "xor"],
  ["Linksverschiebung", "shiftL"],
  ["Rechtsverschiebung", "shiftR"],
];
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND =
  "gibt wahr zurück, falls beide Werte wahr sind";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR =
  "gibt wahr zurück, falls mindestens einer der Werte wahr ist";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_xor =
  "gibt wahr zurück, falls nur einer der Werte wahr ist";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_shiftR = "macht eine Rechtsverschiebung";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_shiftL = "macht eine Linksverschiebung";
Blockly.Msg.LOGIC_TERNARY_CONDITION = "Test";
Blockly.Msg.LOGIC_TERNARY_IF_FALSE = "falls falsch";
Blockly.Msg.LOGIC_TERNARY_IF_TRUE = "falls wahr";
Blockly.Msg.LOGIC_TERNARY_TOOLTIP =
  "Überprüfe die Bedingung in 'Test'. Falls sie wahr ist, gebe den Wert 'falls wahr' zurück, sonst gebe den Wert 'falls falsch' zurück";
Blockly.Msg.MATH_ADDITION_SYMBOL = "+"; // untranslated
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD = "gibt die Summe der zwei Zahlen zurück";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE =
  "gibt den Quotienten der zwei Zahlen zurück";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS =
  "gibt die Differenz der zwei Zahlen zurück";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY =
  "gibt das Produkt der zwei Zahlen zurück";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER =
  "gibt die erste Zahl hoch die zweite Zahl zurück";
Blockly.Msg.MATH_CHANGE_TITLE = "erhöhe Variable %1 um %2";
Blockly.Msg.MATH_CHANGE_TOOLTIP = "füge eine Zahl zu der Variablen %1 hinzu";
Blockly.Msg.MATH_CONSTANT_TOOLTIP =
  "gibt eine der folgenden Konstanten zurück: π (3.141 ...), e (2.718 ...), φ (1.618 ...), sqrt (2) (1.414 ...), sqrt (½) (0.707 ...), or ∞ (unendlich) ";
Blockly.Msg.MATH_CONSTRAIN_TITLE = "erzwinge %1 zwischen %2 und %3";
Blockly.Msg.MATH_CONSTRAIN_TOOLTIP =
  "Beschränke eine Zahl so, dass sie zwischen den angegebenen (eingeschlossenen) Grenzwerten liegt";
Blockly.Msg.MATH_DIVISION_SYMBOL = "÷"; // untranslated
Blockly.Msg.MATH_IS_DIVISIBLE_BY = "ist teilbar durch";
Blockly.Msg.MATH_IS_EVEN = "ist gerade";
Blockly.Msg.MATH_IS_NEGATIVE = "ist negativ";
Blockly.Msg.MATH_IS_ODD = "ist ungerade";
Blockly.Msg.MATH_IS_POSITIVE = "ist positiv";
Blockly.Msg.MATH_IS_PRIME = "ist Primzahl";
Blockly.Msg.MATH_IS_TOOLTIP =
  "gibt wahr oder falsch zurück, falls eine Zahl gerade, ungerade, positiv, negativ, teilbar durch Zahl, eine Primzahl oder Ganzzahl ist";
Blockly.Msg.MATH_IS_WHOLE = "ist Ganzzahl";
Blockly.Msg.MATH_MODULO_TITLE = "Rest für %1 ÷ %2";
Blockly.Msg.MATH_MODULO_TOOLTIP =
  "gibt den Rest der euklidischen Division von zwei Zahlen zurück";
Blockly.Msg.MATH_MULTIPLICATION_SYMBOL = "×"; // untranslated
Blockly.Msg.MATH_NUMBER_TOOLTIP = "eine Zahl";
Blockly.Msg.MATH_ONLIST_HELPURL = ""; // untranslated
Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE = "Listendurchschnitt";
Blockly.Msg.MATH_ONLIST_OPERATOR_MAX = "Maximum der Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN = "Median der Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_MIN = "Minimum der Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_MODE = "Überzahl der Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_RANDOM = "zufälliges Element der Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV = "Standardabweichung der Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_SUM = "Summe der Liste";
Blockly.Msg.MATH_ONLIST_TOOLTIP_AVERAGE =
  "gibt die durchschnittlichen (arithmetischen) numerischen Werte in der Liste zurück";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MAX = "gibt die größte Zahl in der Liste zurück";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MEDIAN =
  "gibt die mittlere Zahl der Liste zurück";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MIN = "gibt die kleinste Zahl in der Liste zurück";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MODE =
  "gibt eine Liste der am häufigsten vorkommenden Elemente in dieser Liste zurück";
Blockly.Msg.MATH_ONLIST_TOOLTIP_RANDOM = "gibt ein zufälliges Element aus der Liste zurück";
Blockly.Msg.MATH_ONLIST_TOOLTIP_STD_DEV =
  "gibt die Standardabweichung der Liste zurück";
Blockly.Msg.MATH_ONLIST_TOOLTIP_SUM =
  "gibt die Summe aller Elemente in der liste zurück";
Blockly.Msg.MATH_POWER_SYMBOL = "^"; // untranslated
Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM = "zufälliger Bruch";
Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP =
  "gibt einen zufälligen Bruch zwischen 0.0 (inklusiv) und 1.0 (exklusiv)";
Blockly.Msg.MATH_RANDOM_INT_TITLE = "zufällige Ganzzahl zwischen %1 & %2";
Blockly.Msg.MATH_RANDOM_INT_TOOLTIP =
  "gibt eine zufällige Ganzzahl zwischen den beiden angegebenen, eingeschlossenen Grenzen";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUND = "runde";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN = "runde ab";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDUP = "runde auf";
Blockly.Msg.MATH_ROUND_TOOLTIP = "runde eine Zahl nach oben oder unten";
Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE = "Absolutwert";
Blockly.Msg.MATH_SINGLE_OP_ROOT = "Quadratwurzel";
Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS = "gibt den Absolutwert einer Zahl zurück";
Blockly.Msg.MATH_SINGLE_TOOLTIP_EXP = "gibt e hoch eine Zahl an";
Blockly.Msg.MATH_SINGLE_TOOLTIP_LN =
  "gibt den natürlichen Logarithmus einer Zahl zurück";
Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG10 =
  "gibt den dekadischen Logarithmus einer Zahl zurück";
Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG = "gibt die Negation einer Zahl zurück";
Blockly.Msg.MATH_SINGLE_TOOLTIP_POW10 = "gibt 10 hoch eine Zahl zurück";
Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT = "gibt die Quadratwurzel einer Zahl zurück";
Blockly.Msg.MATH_SUBTRACTION_SYMBOL = "-"; // untranslated
Blockly.Msg.MATH_TRIG_ACOS = "arccos"; // untranslated
Blockly.Msg.MATH_TRIG_ASIN = "arcsin"; // untranslated
Blockly.Msg.MATH_TRIG_ATAN = "arctan"; // untranslated
Blockly.Msg.MATH_TRIG_COS = "cos"; // untranslated
Blockly.Msg.MATH_TRIG_SIN = "sin"; // untranslated
Blockly.Msg.MATH_TRIG_TAN = "tan"; // untranslated
Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS = "gibt den Arcuscosinus einer Zahl zurück";
Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN = "gibt den Arcussinus einer Zahl zurück";
Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN = "gibt den Arcustangens einer Zahl zurück";
Blockly.Msg.MATH_TRIG_TOOLTIP_COS = "gibt den Kosinus eines Winkels in Grad zurück";
Blockly.Msg.MATH_TRIG_TOOLTIP_SIN = "gibt den Sinus eines Winkels in Grad zurück";
Blockly.Msg.MATH_TRIG_TOOLTIP_TAN = "gibt den Tangens eines Winkels in Grad zurück";
Blockly.Msg.NEW_VARIABLE = "Erstelle eine Variable";
Blockly.Msg.NEW_VARIABLE_TITLE = "Neuer Name für die Variable";
Blockly.Msg.ORDINAL_NUMBER_SUFFIX = ""; // untranslated
Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP = "Führe eine nutzerdefinierte Funktion %1 aus";
Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP =
  "Führe eine nutzerdefinierte Funktion %1 aus und nutze das Ergebnis";
Blockly.Msg.PROCEDURES_CREATE_DO = "Erstelle %1";
Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT = "Beschreibe diese Funktion";
Blockly.Msg.PROCEDURES_DEFNORETURN_DO = "";
Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = "mache";
Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "";
Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP =
  "Erstelle eine Prozedur oder Funktion ohne Datenrückgabe";
Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = "gebe zurück";
Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP =
  "Erstelle eine Prozedur oder Funktion mit Datenrückgabe";
Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING =
  "Warnung: Diese Funktion hat doppelte Einstellungen";
Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF = "Hebe die Funktionsdefinition hervor";
Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP = "gibt den angegebenen Wert zurück";
Blockly.Msg.PROCEDURES_IFRETURN_WARNING =
  "Warnung: Dieser Block muss in einer Prozedur- oder Funktionsdefinition benutzt werden";
Blockly.Msg.PROCEDURES_MUTATORARG_TYPE = "vom Typ";
Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP =
  "Füge einen Eintrag zu der Prozedur oder Funktion hinzu";
Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE = "Eingabeargumente";
Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP = "Hinzufügen, löschen, oder neuordnen";
Blockly.Msg.REDO = "Wiederhole";
Blockly.Msg.REMOVE_COMMENT = "Lösche ein Kommentar";
Blockly.Msg.RENAME_VARIABLE = "Benenne Variable '%1' um";
Blockly.Msg.RENAME_VARIABLE_TITLE = "Benenne Variablen '%1' um";
//Array
Blockly.Msg.ARRAY_CREATE_EMPTY_TITLE = "leer!";
Blockly.Msg.tab_create = "Erstelle Block 'Element des Feldes %1'";
Blockly.Msg.tab_create_fix = "Erstelle Block 'füge ein Element aus dem Feld %1 zu '";
Blockly.Msg.ARRAY_CREATE_WITH = "besteht aus";
Blockly.Msg.ARRAY_taille = "Größe";
Blockly.Msg.ARRAY_contenu = "welches beinhaltet";
Blockly.Msg.ARRAY_CREATE_WITH_CONTAINER_TITLE_ADD = "Liste oder Feld";
Blockly.Msg.ARRAY_CREATE_WITH_CONTAINER_TOOLTIP = "Hinzufügen, löschen, oder neuordnen";
Blockly.Msg.ARRAY_CREATE_WITH_INPUT_WITH = "Elemente";
Blockly.Msg.ARRAY_CREATE_WITH_ITEM_TITLE = "Element";
Blockly.Msg.ARRAY_CREATE_WITH_TOOLTIP = "Gibt eine Liste mit einer Anzahl von Elementen zurück";
Blockly.Msg.ARRAY_GETINDEX_ITEM = "das Element des Feldes";
Blockly.Msg.ARRAY_GETINDEX_ITEM2 = "Feld";
Blockly.Msg.ARRAY_GETINDEX_TOOLTIP1 = "gibt den gespeicherten Wert aus der Liste zurück";
Blockly.Msg.ARRAY_GETINDEX_TOOLTIP2 = "erstellt ein Feld des ausgewählten Typs";
Blockly.Msg.ARRAY_GETINDEX_TOOLTIP3 =
  "fixiere ein Element der Liste oder des Feldes auf den angegebenen Wert";
Blockly.Msg.ARRAY_create = "setze Feld";
Blockly.Msg.ARRAY_fixe = "setze das Element des Feldes";
Blockly.Msg.ARRAY_dim = "Größe von";
Blockly.Msg.ARRAY_index = "Index";
Blockly.Msg.ARRAY_append_tooltip =
  "füge ein Element an das Ende der Liste oder des Feldes";
Blockly.Msg.ARRAY_append_url = "";
Blockly.Msg.size = "Feldgröße";
Blockly.Msg.size_TOOLTIP = "gibt die Größe der Liste oder des Feldes zurück";
//text
Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP = "Füge ein Element hinzu";
Blockly.Msg.TEXT_CREATE_JOIN_TITLE_JOIN = "Text";
Blockly.Msg.TEXT_CREATE_JOIN_TOOLTIP = "Hinzufügen, löschen, oder neuordnen";
Blockly.Msg.TEXT_ISEMPTY_TITLE = "%1 ist leer";
Blockly.Msg.TEXT_ISEMPTY_TOOLTIP = "gibt wahr zurück, falls der gelieferte Text leer ist";
Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH = "Text erstellt mit";
Blockly.Msg.TEXT_JOIN_TOOLTIP =
  "gibt einen Text zurück, der eine beliebige Anzahl von Elementen anhäuft";
Blockly.Msg.TEXT_LENGTH_TITLE = "Länge von %1";
Blockly.Msg.TEXT_LENGTH_TOOLTIP =
  "gibt die Anzahl von Buchstaben (inklusive Leerzeichen) des gelieferten Texts zurück";
Blockly.Msg.TEXT_PRINT_TITLE = "zeige %1";
Blockly.Msg.TEXT_PRINT_TOOLTIP = "Zeige einen Text, eine Zahl oder einen anderen angegebenen Wert";
Blockly.Msg.TEXT_TEXT_TOOLTIP = "Ein Buchstabe, ein Wort oder eine Phrase";
Blockly.Msg.TODAY = "Heute";
Blockly.Msg.UNDO = "Abbrechen";
Blockly.Msg.VARIABLES_AS = "Typ";
Blockly.Msg.VARIABLES_DEFAULT_NAME = "var";
Blockly.Msg.VARIABLES_GET_CREATE_SET = "Erstelle Block 'setze Variable %1 zu '";
Blockly.Msg.VARIABLES_GET_TOOLTIP = "gibt den Wert dieser Variablen zurück";
Blockly.Msg.VARIABLES_SET = "setze die Variable";
Blockly.Msg.VARIABLES_SET_CREATE_GET = "Erstelle Block %1";
Blockly.Msg.VARIABLES_SET_TOOLTIP = "Setze die Variable auf den spezifizierten Wert";
Blockly.Msg.var_set_init = "setze Variable";
Blockly.Msg.var_set_init_tooltip =
  "Deklariere und initialisiere die Variable des angegebenen Typs und Werts";
Blockly.Msg.ARDUINO_VAR_CONST = "setze Konstante";
Blockly.Msg.ARDUINO_VAR_CONST_tooltip =
  "Deklariere eine Konstante des angegebenen Typs und Werts";
Blockly.Msg.VARIABLE_ALREADY_EXISTS = "Eine Variable mit dem Name %1 existiert bereits";
Blockly.Msg.PROCEDURES_DEFRETURN_TITLE = "";
Blockly.Msg.CONTROLS_IF_IF_TITLE_IF = Blockly.Msg.CONTROLS_IF_MSG_IF;
Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.CONTROLS_IF_MSG_THEN = "dann";
Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = Blockly.Msg.CONTROLS_IF_MSG_ELSE;
Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE =
  Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE;
Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.LISTS_GET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.MATH_CHANGE_TITLE_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.PROCEDURES_DEFRETURN_DO = Blockly.Msg.PROCEDURES_DEFNORETURN_DO;
Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF =
  Blockly.Msg.CONTROLS_IF_MSG_ELSEIF;
Blockly.Msg.LISTS_GET_INDEX_HELPURL = Blockly.Msg.LISTS_INDEX_OF_HELPURL;
Blockly.Msg.CONTROLS_FOREACH_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.CONTROLS_FOR_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM =
  Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.LISTS_INDEX_OF_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT =
  Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT;
