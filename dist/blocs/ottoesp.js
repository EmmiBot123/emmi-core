'use strict';

goog.provide('Blockly.Blocks.arduino');
goog.require('Blockly.Blocks');
goog.require('Blockly.Types');
goog.require('Blockly.FieldInstance');
goog.provide('Blockly.Arduino.ottoesp');
goog.require('Blockly.Arduino');

goog.provide('Blockly.Blocks.esp32servo');
goog.provide('Blockly.Arduino.esp32servo');

goog.require('Blockly.Blocks');
goog.require('Blockly.Arduino');


Blockly.Blocks['otto_configuration'] = {init: function() {
	var card=window.localStorage.card;
    this.appendDummyInput("") .appendField(new Blockly.FieldImage('media/otto_emoji.png', 33, 33, "*")) .appendField(Blockly.Msg.OTTO_HOME_TEXT+Blockly.Msg.OTTO_BIPED_TEXT);
	this.appendDummyInput()
	.appendField(Blockly.Msg.OTTO9_CALIBRATION_LEG+Blockly.Msg.left).setAlign(Blockly.ALIGN_RIGHT)
	.appendField(new Blockly.FieldDropdown(profile[card].dropdownAllPins), "PIN_YL");
	this.appendDummyInput()
	.appendField(Blockly.Msg.right) .setAlign(Blockly.ALIGN_RIGHT)
	.appendField(new Blockly.FieldDropdown(profile[card].dropdownAllPins), "PIN_YR");
	this.appendDummyInput()
	.appendField(Blockly.Msg.OTTO9_CALIBRATION_FOOT+Blockly.Msg.left).setAlign(Blockly.ALIGN_RIGHT)
	.appendField(new Blockly.FieldDropdown(profile[card].dropdownAllPins), "PIN_RL");
	this.appendDummyInput()
	.appendField(Blockly.Msg.right).setAlign(Blockly.ALIGN_RIGHT)
	.appendField(new Blockly.FieldDropdown(profile[card].dropdownAllPins), "PIN_RR");
	this.appendDummyInput()
	.appendField(Blockly.Msg.OTTO9_BUZZER).setAlign(Blockly.ALIGN_RIGHT)
	.appendField(new Blockly.FieldDropdown(profile[card].dropdownAllPins), "PIN_Buzzer");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);  }
};

Blockly.Arduino['otto_configuration'] = function(block) {

  var PIN_YL= block.getFieldValue('PIN_YL');
  var PIN_YR= block.getFieldValue('PIN_YR');
  var PIN_RL= block.getFieldValue('PIN_RL');
  var PIN_RR= block.getFieldValue('PIN_RR');
  var PIN_Buzzer= block.getFieldValue('PIN_Buzzer');

  Blockly.Arduino.includes_['otto_lib'] = '#include <Otto.h>\n'
	+ 'Otto Otto;';

  Blockly.Arduino.definitions_['otto_legs'] = '#define LeftLeg '+ PIN_YL +' // left leg pin, servo[0]\n'
 	+ '#define RightLeg '+ PIN_YR +' // right leg pin, servo[1]\n'
	+ '#define LeftFoot '+ PIN_RL +' // left foot pin, servo[2]\n'
    + '#define RightFoot '+ PIN_RR +' // right foot pin, servo[3]\n'
    + '#define Buzzer '+ PIN_Buzzer +' //buzzer pin \n';

  Blockly.Arduino.setups_['otto_init']='Otto.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer);\n'
  + 'Otto.home();\n';
  var code = '';
  return code;
};








Blockly.Blocks['otto_home'] = {init: function() {
    this.appendDummyInput("") .appendField(new Blockly.FieldImage('media/otto_plus.png', 22, 22, "*")) .appendField(Blockly.Msg.OTTO9_HOME_TEXT);
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setTooltip(Blockly.Msg.OTTO9_HOME_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);  }
};

Blockly.Arduino['otto_home'] = function(block) {

  var code = 'Otto.home();\n';
  return code;
};



Blockly.Blocks['esp32servo_home'] = {
  init: function() {
    this.appendDummyInput("")
      .appendField(new Blockly.FieldImage('media/otto_plus.png', 22, 22, "*"))
      .appendField(Blockly.Msg.OTTO9_HOME_TEXT);
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setTooltip("Move all servos to 90 degrees (ESP32)");
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);
  }
};
Blockly.Arduino['esp32servo_home'] = function(block) {

  var code =
    'leftLeg.write(90);\n' +
    'rightLeg.write(90);\n' +
    'leftFoot.write(90);\n' +
    'rightFoot.write(90);\n';

  return code;
};


Blockly.Blocks['otto_calibration']={init:function(){

this.appendValueInput("LL") .setCheck("Number").appendField("🦿 "+ Blockly.Msg.OTTO9_CALIBRATION + Blockly.Msg.OTTO9_CALIBRATION_LEG + Blockly.Msg.left).setAlign(Blockly.ALIGN_RIGHT)
this.appendValueInput("RL") .setCheck("Number").appendField(Blockly.Msg.right) .setAlign(Blockly.ALIGN_RIGHT)
this.appendValueInput("LF") .setCheck("Number").appendField(Blockly.Msg.OTTO9_CALIBRATION_FOOT+ Blockly.Msg.left).setAlign(Blockly.ALIGN_RIGHT)
this.appendValueInput("RF") .setCheck("Number").appendField(Blockly.Msg.right).setAlign(Blockly.ALIGN_RIGHT)
  this.setInputsInline(true);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setColour("#4759F5");
  this.setTooltip(Blockly.Msg.OTTO9_CALIBRATION_TOOLTIP);
  this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);}
};

Blockly.Arduino['otto_calibration']=function(block){
var valuell= Blockly.Arduino.valueToCode(block, 'LL', Blockly.Arduino.ORDER_ATOMIC);
var valuerl= Blockly.Arduino.valueToCode(block, 'RL', Blockly.Arduino.ORDER_ATOMIC);
var valuelf= Blockly.Arduino.valueToCode(block, 'LF', Blockly.Arduino.ORDER_ATOMIC);
var valuerf= Blockly.Arduino.valueToCode(block, 'RF', Blockly.Arduino.ORDER_ATOMIC);

  var code = 'Otto.setTrims('+ valuell +','+ valuerl +',' +valuelf +','+ valuerf+');\n';
  return code;
};

Blockly.Blocks['otto_eeprom'] = {init: function() {
    this.appendDummyInput("")  .appendField("💾 " +Blockly.Msg.OTTO9_EEPROM_TEXT);
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#ff6600");
    this.setTooltip(Blockly.Msg.OTTO9_EEPROM_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);}
};

Blockly.Arduino['otto_eeprom'] = function(block) {
  var code = 'Otto.saveTrimsOnEEPROM();\n';
  return code;
};

Blockly.Blocks['otto_movelegs'] = {init: function() {
this.appendDummyInput("") .appendField("🦿 "+ Blockly.Msg.OTTO9_MOVE_TEXT);
this.appendValueInput("PIN_YL") .setCheck("Number").appendField(Blockly.Msg.OTTO9_CALIBRATION_LEG+ Blockly.Msg.left)
this.appendValueInput("PIN_YR") .setCheck("Number").appendField(Blockly.Msg.right)
this.appendValueInput("PIN_RL") .setCheck("Number").appendField(Blockly.Msg.OTTO9_CALIBRATION_FOOT+ Blockly.Msg.left)
this.appendValueInput("PIN_RR") .setCheck("Number").appendField(Blockly.Msg.right)
this.appendValueInput("TEMPO") .setCheck("Number").appendField(Blockly.Msg.OTTO9_MOVE_SPEED_TEXT)
  this.setInputsInline(true);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setColour("#4759F5");
  this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);  }
};

Blockly.Arduino['otto_movelegs'] = function(block) {
var PIN_YL= Blockly.Arduino.valueToCode(block, 'PIN_YL', Blockly.Arduino.ORDER_ATOMIC);
var PIN_YR= Blockly.Arduino.valueToCode(block, 'PIN_YR', Blockly.Arduino.ORDER_ATOMIC);
var PIN_RL= Blockly.Arduino.valueToCode(block, 'PIN_RL', Blockly.Arduino.ORDER_ATOMIC);
var PIN_RR= Blockly.Arduino.valueToCode(block, 'PIN_RR', Blockly.Arduino.ORDER_ATOMIC);
var TEMPO= Blockly.Arduino.valueToCode(block, 'TEMPO', Blockly.Arduino.ORDER_ATOMIC);

Blockly.Arduino.definitions_['otto_movelegs'] = ' void Otto_moveLegs(int T, int posLegL, int posLegR, int posFootL, int posFootR) {   int posLegs[]={ posLegL,posLegR,posFootL,posFootR };   Otto._moveServos(T,posLegs); }';

Blockly.Arduino.setups_['otto_movelegs']='Otto_moveLegs('+200+','+90+','+90+','+90+','+90+');';

var code = 'Otto_moveLegs('+TEMPO+','+PIN_YL+','+PIN_YR+','+PIN_RL+','+PIN_RR+');';
return code;
};

Blockly.Blocks['otto_moveservos'] = {init: function() {
  this.appendDummyInput("") .appendField("🦿 "+ Blockly.Msg.OTTO9_MOVE_TEXT);
  this.appendValueInput("Period") .setCheck("Number").appendField(Blockly.Msg.OTTO9_MOVE_SPEED_TEXT)
  this.appendValueInput("Pos") .setCheck("Number").appendField("Positions")
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);  }
  };

  Blockly.Arduino['otto_moveservos'] = function(block) {
  var Period= Blockly.Arduino.valueToCode(block, 'Period', Blockly.Arduino.ORDER_ATOMIC);
  var Pos= Blockly.Arduino.valueToCode(block, 'Pos', Blockly.Arduino.ORDER_ATOMIC);
  var code = ' Otto._moveServos('+Period+', '+Pos+');';
  return code;
  };
Blockly.Blocks['esp32servo_move'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('media/otto_bend.png', 22, 22, "*"))
      .appendField(Blockly.Msg.OTTO9_MOVE_TEXT)
      .appendField(
        new Blockly.FieldDropdown(Blockly.Msg.OTTO9_MOVE_CHOICE),
        "esp32_move_sens"
      );

    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.OTTO9_MOVE_SPEED_TEXT)
      .appendField(
        new Blockly.FieldDropdown(Blockly.Msg.OTTO9_MOVE_SPEED_CHOICE),
        "esp32_move_speed"
      );

    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setTooltip("ESP32 Servo based movement");
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);
  }
};
Blockly.Arduino['esp32servo_move'] = function(block) {

  var dir   = block.getFieldValue('esp32_move_sens');
  var speed = block.getFieldValue('esp32_move_speed'); // used as delay (ms)

  var t = speed; // simple, predictable
  var code = '';

  switch (dir) {

    // ---------- FORWARD ----------
 case 'FORWARD':
  code =
    // 1️⃣ PRE-BALANCE (LEAN LEFT, NOT LIFT)
    'leftFoot.write(110);\n' +    // LEFT ANKLE LEANS IN
    'rightFoot.write(95);\n' +    // RIGHT FOOT STILL TOUCHING
    'leftLeg.write(105);\n' +     // LEFT LEG SUPPORT
    'delay(' + t + ');\n' +

    // 2️⃣ UNLOAD RIGHT FOOT (SMALL LIFT)
    'rightFoot.write(115);\n' +   // SMALL, SAFE LIFT
    'delay(' + t + ');\n' +

    // 3️⃣ SWING RIGHT LEG (CONTROLLED)
    'rightLeg.write(60);\n' +
    'delay(' + t + ');\n' +

    // 4️⃣ LAND + RECENTER
    'rightFoot.write(90);\n' +
    'leftFoot.write(90);\n' +
    'leftLeg.write(90);\n' +
    'rightLeg.write(90);\n' +
    'delay(' + t + ');\n';
  break;


    // ---------- BACKWARD ----------
    case 'BACKWARD':
      code =
        'leftFoot.write(125);\n' +
        'rightFoot.write(55);\n' +
        'delay(' + t + ');\n' +
        'rightLeg.write(120);\n' +
        'delay(' + t + ');\n' +
        'leftLeg.write(90);\n' +
        'rightLeg.write(90);\n' +
        'leftFoot.write(90);\n' +
        'rightFoot.write(90);\n';
      break;

    // ---------- TURN LEFT ----------
    case 'LEFT':
      code =
        'leftLeg.write(120);\n' +
        'rightLeg.write(60);\n' +
        'delay(' + t + ');\n' +
        'leftLeg.write(90);\n' +
        'rightLeg.write(90);\n';
      break;

    // ---------- TURN RIGHT ----------
    case 'RIGHT':
      code =
        'leftLeg.write(60);\n' +
        'rightLeg.write(120);\n' +
        'delay(' + t + ');\n' +
        'leftLeg.write(90);\n' +
        'rightLeg.write(90);\n';
      break;

    // ---------- BEND LEFT ----------
    case 'BENDLEFT':
      code =
        'leftLeg.write(70);\n' +
        'delay(' + t + ');\n' +
        'leftLeg.write(90);\n';
      break;

    // ---------- BEND RIGHT ----------
    case 'BENDRIGHT':
      code =
        'rightLeg.write(110);\n' +
        'delay(' + t + ');\n' +
        'rightLeg.write(90);\n';
      break;

    // ---------- SHAKE RIGHT ----------
    case 'SHAKERIGHT':
      code =
        'rightLeg.write(60);\n' +
        'delay(' + t + ');\n' +
        'rightLeg.write(120);\n' +
        'delay(' + t + ');\n' +
        'rightLeg.write(90);\n';
      break;

    // ---------- SHAKE LEFT ----------
    case 'SHAKELEFT':
      code =
        'leftLeg.write(60);\n' +
        'delay(' + t + ');\n' +
        'leftLeg.write(120);\n' +
        'delay(' + t + ');\n' +
        'leftLeg.write(90);\n';
      break;

    // ---------- JUMP ----------
    case 'jump':
      code =
        'leftLeg.write(70);\n' +
        'rightLeg.write(70);\n' +
        'delay(' + t + ');\n' +
        'leftLeg.write(90);\n' +
        'rightLeg.write(90);\n';
      break;
  }

  return code;
};


Blockly.Blocks['otto_move'] = {init: function() {
    this.appendDummyInput() .appendField(new Blockly.FieldImage('media/otto_bend.png', 22, 22, "*"))
        .appendField(Blockly.Msg.OTTO9_MOVE_TEXT) .appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_MOVE_CHOICE), "otto_move_sens");
    this.appendDummyInput() .setAlign(Blockly.ALIGN_RIGHT) .appendField(Blockly.Msg.OTTO9_MOVE_SPEED_TEXT)  .appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_MOVE_SPEED_CHOICE), "otto_move_speed");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setTooltip(Blockly.Msg.OTTO9_MOVE_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);}
};

Blockly.Arduino['otto_move'] = function(block) {
  var dropdown_otto_move_sens = block.getFieldValue('otto_move_sens');
  var dropdown_otto_move_speed = block.getFieldValue('otto_move_speed');

  var code = '';
  switch(dropdown_otto_move_sens) {
	case 'FORWARD':
		code = 'Otto.walk(1,' + dropdown_otto_move_speed + ',1); // FORWARD\n';
		break;
	case 'BACKWARD':
		code = 'Otto.walk(1,' + dropdown_otto_move_speed + ',-1); // BACKWARD\n';
		break;
	case 'LEFT':
		code = 'Otto.turn(1,' + dropdown_otto_move_speed + ',1); // LEFT\n';
		break;
	case 'RIGHT':
		code = 'Otto.turn(1,' + dropdown_otto_move_speed + ',-1); // RIGHT\n';
		break;
	case 'BENDLEFT':
		code = 'Otto.bend(1,' + dropdown_otto_move_speed + ',1);\n';
		break;
	case 'BENDRIGHT':
		code = 'Otto.bend(1,' + dropdown_otto_move_speed + ',-1);\n';
		break;
	case 'SHAKERIGHT':
		code = 'Otto.shakeLeg(1,' + dropdown_otto_move_speed + ',1);\n';
		break;
	case 'SHAKELEFT':
		code = 'Otto.shakeLeg(1,' + dropdown_otto_move_speed + ',-1);\n';
    break;
    case 'jump':
		code = 'Otto.jump(1,' + dropdown_otto_move_speed + ');\n';
		break;
  }
  return code;
};



Blockly.Blocks['otto_dance'] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly.FieldImage('media/otto_moonwalk.png', 22, 22, "*")).appendField(Blockly.Msg.OTTO9_DANCE_TEXT)
        .appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_DANCE_CHOICE), "otto_dance_movement");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(Blockly.Msg.OTTO9_MOVE_SPEED_TEXT)
        .appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_MOVE_SPEED_CHOICE), "otto_move_speed");
    this.appendDummyInput()
    .setAlign(Blockly.ALIGN_RIGHT).appendField(Blockly.Msg.OTTO9_DANCE_SIZE_TEXT)
        .appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_DANCE_SIZE_CHOICE), "otto_dance_size");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setTooltip(Blockly.Msg.OTTO9_DANCE_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL); }
};

Blockly.Arduino['otto_dance'] = function(block) {
  var dropdown_otto_dance_movement = block.getFieldValue('otto_dance_movement');
  var dropdown_otto_move_speed = block.getFieldValue('otto_move_speed');
  var dropdown_otto_dance_size = block.getFieldValue('otto_dance_size');

  var code = '';
  switch(dropdown_otto_dance_movement) {
    case 'moonwalkerLEFT':
      code = 'Otto.moonwalker(1, ' + dropdown_otto_move_speed + ', ' + dropdown_otto_dance_size + ', 1);\n';
      break;
    case 'moonwalkerRIGHT':
      code = 'Otto.moonwalker(1, ' + dropdown_otto_move_speed + ', ' + dropdown_otto_dance_size + ', -1);\n';
      break;
    case 'crusaitoLEFT':
      code = 'Otto.crusaito(1, ' + dropdown_otto_move_speed + ', ' + dropdown_otto_dance_size + ', 1);\n';
      break;
    case 'crusaitoRIGHT':
      code = 'Otto.crusaito(1, ' + dropdown_otto_move_speed + ', ' + dropdown_otto_dance_size + ', -1);\n';
      break;
    case 'flappingFRONT':
      code = 'Otto.flapping(1, ' + dropdown_otto_move_speed + ', ' + dropdown_otto_dance_size + ', 1);\n';
      break;
    case 'flappingBACK':
      code = 'Otto.flapping(1, ' + dropdown_otto_move_speed + ', ' + dropdown_otto_dance_size + ', -1);\n';
      break;
    }
  return code;
};

Blockly.Blocks['otto_do'] = {init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage('media/otto_do.png', 22, 22, "*"))
        .appendField(Blockly.Msg.OTTO9_DO_TEXT).appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_DO_CHOICE), "otto_do_movement");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.OTTO9_MOVE_SPEED_TEXT).appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_MOVE_SPEED_CHOICE), "otto_move_speed");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.OTTO9_DANCE_SIZE_TEXT).appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_DANCE_SIZE_CHOICE), "otto_dance_size");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setTooltip(Blockly.Msg.OTTO9_DO_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);  }
};

Blockly.Arduino['otto_do'] = function(block) {
  var dropdown_otto_do_movement = block.getFieldValue('otto_do_movement');
  var dropdown_otto_move_speed = block.getFieldValue('otto_move_speed');
  var dropdown_otto_dance_size = block.getFieldValue('otto_dance_size');

  var code = 'Otto.' + dropdown_otto_do_movement + '(1, ' + dropdown_otto_move_speed + ', ' + dropdown_otto_dance_size + ');\n';
  return code;
};

Blockly.Blocks['otto_gesture'] = {init: function() {
    this.appendDummyInput() .appendField(new Blockly.FieldImage('media/otto_emoji.png', 22, 22, "*")).appendField(Blockly.Msg.OTTO9_GESTURE_TEXT) .appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_GESTURE_CHOICE), "otto_gesture");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#4759F5");
    this.setTooltip(Blockly.Msg.OTTO9_GESTURE_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL); }
};

Blockly.Arduino['otto_gesture'] = function(block) {
  var dropdown_otto_gesture = block.getFieldValue('otto_gesture');

  var code = 'Otto.playGesture(' + dropdown_otto_gesture + ');\n';
  return code;
};

Blockly.Blocks['otto_sound'] = {init: function() {
    this.appendDummyInput() .appendField(new Blockly.FieldImage('media/otto_music.png', 22, 22, "*")) .appendField(Blockly.Msg.OTTO9_SOUND_TEXT) .appendField(new Blockly.FieldDropdown(Blockly.Msg.OTTO9_SOUND_CHOICE), "otto_sound");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#FF63BB");
    this.setTooltip(Blockly.Msg.OTTO9_SOUND_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL); }
};

Blockly.Arduino['otto_sound'] = function(block) {
  var dropdown_otto_sound = block.getFieldValue('otto_sound');

  var code = 'Otto.sing(' + dropdown_otto_sound + ');\n';
  return code;
};

Blockly.Blocks['otto_tone'] = {init: function() {
    this.appendDummyInput().appendField("🎼")
        .appendField(new Blockly.FieldDropdown([["C₄ | Do₄", "262"], ["D₄ | Re₄", "294"], ["E₄ | Mi₄", "330"], ["F₄ | Fa₄", "349"], ["G₄ | Sol₄", "392"], ["A₄ | La₄", "440"], ["B₄ | Si₄", "494"], ["C₅ | Do₅", "523"], ["D₅ | Re₅", "587"] ,["E₅ | Mi₅", "659"], ["F₅ | Fa₅", "698"], ["G₅ | Sol₅", "784"], ["A₅ | La₅", "880"], ["B₅ | Si₅", "988"], ["C₆ | Do₆", "1047"], ["D₆ | Re₆", "1175"], ["E₆ | Mi₆", "1319"], ["F₆ | Fa₆", "1397"], ["G₆ | Sol₆", "1568"], ["A₆ | La₆", "1760"], ["B₆ | Si₆", "1976"]]), "otto_note");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(" ")
        .appendField(new Blockly.FieldDropdown([["\u266B", "125"], ["\u266A", "250"], ["\u2669", "500"], ["𝅗𝅥", "1000"], ["𝅝", "2000"]]), "otto_note_duration");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#FF63BB");
    this.setTooltip(Blockly.Msg.OTTO9_SOUND_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);
}
};

Blockly.Arduino['otto_tone'] = function(block) {
  var dropdown_otto_note = block.getFieldValue('otto_note');
  var dropdown_otto_note_duration = block.getFieldValue('otto_note_duration');

  var code = "Otto._tone( " + dropdown_otto_note + "," + dropdown_otto_note_duration + ",1);\n";
return code;
};

Blockly.Blocks['otto_tonehz'] = {init: function() {
  this.appendDummyInput() .appendField("🎼 Hz")
  this.appendValueInput("Hz1")
  this.appendValueInput("duration") .setCheck("Number").appendField("⏰");
  this.appendValueInput("silent") .setCheck("Number").appendField("🔇");
  this.setInputsInline(true);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setColour("#FF63BB");
  this.setTooltip(Blockly.Msg.OTTO9_SOUND_TOOLTIP);
  this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);
}
};

Blockly.Arduino['otto_tonehz'] = function(block) {
  var Hz1 = Blockly.Arduino.valueToCode(block, 'Hz1', Blockly.Arduino.ORDER_ATOMIC);
  var duration = Blockly.Arduino.valueToCode(block, 'duration', Blockly.Arduino.ORDER_ATOMIC);
  var silent = Blockly.Arduino.valueToCode(block, 'silent', Blockly.Arduino.ORDER_ATOMIC);

var code = "Otto._tone( " + Hz1 + "," + duration + "," + silent + "); //(float noteFrequency, long noteDuration, int silentDuration)\n";
return code;
};

Blockly.Blocks['otto_bendtone'] = {init: function() {
  this.appendDummyInput() .appendField("🎼 Hz1")
  this.appendValueInput("Hz1")
  this.appendValueInput("Hz2") .appendField("Hz2");
  this.appendValueInput("prop") .setCheck("Number").appendField("P");
  this.appendValueInput("duration") .setCheck("Number").appendField("⏰");
  this.appendValueInput("silent") .setCheck("Number").appendField("🔇");
  this.setInputsInline(true);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setColour("#FF63BB");
  this.setTooltip(Blockly.Msg.OTTO9_SOUND_TOOLTIP);
  this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);
}
};

Blockly.Arduino['otto_bendtone'] = function(block) {
  var Hz1 = Blockly.Arduino.valueToCode(block, 'Hz1', Blockly.Arduino.ORDER_ATOMIC);
  var Hz2 = Blockly.Arduino.valueToCode(block, 'Hz2', Blockly.Arduino.ORDER_ATOMIC);
  var prop = Blockly.Arduino.valueToCode(block, 'prop', Blockly.Arduino.ORDER_ATOMIC);
  var duration = Blockly.Arduino.valueToCode(block, 'duration', Blockly.Arduino.ORDER_ATOMIC);
  var silent = Blockly.Arduino.valueToCode(block, 'silent', Blockly.Arduino.ORDER_ATOMIC);

  var code = "Otto.bendTones( " + Hz1 + "," + Hz2 + "," + prop + "," + duration + "," + silent + "); // (float initFrequency, float finalFrequency, float prop, long noteDuration, int silentDuration) \n";
  return code;
};

Blockly.Blocks['otto_getsensor'] = {init: function() {
    this.appendDummyInput().appendField(new Blockly.FieldImage('media/sensor_noise.png', 22, 22, "*")).appendField(Blockly.Msg.OTTO9_GETNOISE_TEXT);
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("#2a93e8");
    this.setTooltip(Blockly.Msg.OTTO9_GETNOISE_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.OTTO9_DIY_URL);
  }
};

Blockly.Arduino['otto_getsensor'] = function(block) {
  Blockly.Arduino.variables_['otto_sensor'] = 'bool estado = false;';

  var code = 'Otto.getSensor()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
