// logic 
if (Blockly.Blocks.inout_onoff) Blockly.Blocks.inout_onoff.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.controls_if) Blockly.Blocks.controls_if.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.controls_switch) Blockly.Blocks.controls_switch.getVars = function () {
	return [this.getFieldValue('SWVAR')];
};
if (Blockly.Blocks.logic_compare) Blockly.Blocks.logic_compare.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.logic_operation) Blockly.Blocks.logic_operation.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.logic_negate) Blockly.Blocks.logic_negate.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.logic_null) Blockly.Blocks.logic_null.getBlockType = function () {
	return Blockly.Types.NULL;
};
// loop 
if (Blockly.Blocks.controls_for) Blockly.Blocks.controls_for.getVars = function () {
	return [this.getFieldValue('VAR')];
};
if (Blockly.Blocks.controls_repeat_ext) Blockly.Blocks.controls_repeat_ext.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.controls_whileUntil) Blockly.Blocks.controls_whileUntil.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.controls_flow_statements) Blockly.Blocks.controls_flow_statements.getVars = function () {
	return Blockly.Types.BOOLEAN;
};
// math 
if (Blockly.Blocks.math_number) Blockly.Blocks.math_number.getBlockType = function () {
	var numString = this.getFieldValue('NUM');
	return Blockly.Types.identifyNumber(numString);
};
if (Blockly.Blocks.inout_angle_maths) Blockly.Blocks.inout_angle_maths.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.math_arithmetic) Blockly.Blocks.math_arithmetic.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.intervalle) Blockly.Blocks.intervalle.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.math_single) Blockly.Blocks.math_single.getBlockType = function () {
	return Blockly.Types.DECIMAL;
};
if (Blockly.Blocks.math_trig) Blockly.Blocks.math_trig.getBlockType = function () {
	return Blockly.Types.DECIMAL;
};
if (Blockly.Blocks.math_constant) Blockly.Blocks.math_constant.getBlockType = function () {
	return Blockly.Types.DECIMAL;
};
if (Blockly.Blocks.math_number_property) Blockly.Blocks.math_number_property.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.math_round) Blockly.Blocks.math_round.getBlockType = function () {
	return Blockly.Types.DECIMAL;
};
if (Blockly.Blocks.math_modulo) Blockly.Blocks.math_modulo.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.math_random_int) Blockly.Blocks.math_random_int.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
// text 
if (Blockly.Blocks.text) Blockly.Blocks.text.getBlockType = function () {
	return Blockly.Types.TEXT;
};
if (Blockly.Blocks.text_char) Blockly.Blocks.text_char.getBlockType = function () {
	return Blockly.Types.TEXT;
};
if (Blockly.Blocks.text_join) Blockly.Blocks.text_join.getBlockType = function () {
	return Blockly.Types.TEXT;
};
if (Blockly.Blocks.text_length) Blockly.Blocks.text_length.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.text_isEmpty) Blockly.Blocks.text_isEmpty.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
// arduino_time 
if (Blockly.Blocks.millis) Blockly.Blocks.millis.getBlockType = function () {
	return Blockly.Types.LARGE_NUMBER;
};
if (Blockly.Blocks.base_delay) Blockly.Blocks.base_delay.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
// arduino_in 
if (Blockly.Blocks.digital_read) Blockly.Blocks.digital_read.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.inout_analog_read) Blockly.Blocks.inout_analog_read.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
// arduino_out 
if (Blockly.Blocks.inout_digital_write) Blockly.Blocks.inout_digital_write.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.inout_analog_write) Blockly.Blocks.inout_analog_write.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
// DEL 
if (Blockly.Blocks.inout_buildin_led) Blockly.Blocks.inout_buildin_led.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.blink) Blockly.Blocks.blink.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.digital_write) Blockly.Blocks.digital_write.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.bargraphe) Blockly.Blocks.bargraphe.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
// matrice 
if (Blockly.Blocks.matrice8x8_init) Blockly.Blocks.matrice8x8_init.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.matrice8x8_symbole) Blockly.Blocks.matrice8x8_symbole.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.matrice8x8_aff) Blockly.Blocks.matrice8x8_aff.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.matrice8x8_del) Blockly.Blocks.matrice8x8_del.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
// arduino_serial 
if (Blockly.Blocks.serial_read) Blockly.Blocks.serial_read.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.serial_available) Blockly.Blocks.serial_available.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};
if (Blockly.Blocks.serial_write) Blockly.Blocks.serial_write.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.serial_init) Blockly.Blocks.serial_init.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.serial_line) Blockly.Blocks.serial_line.getBlockType = function () {
	return Blockly.Types.TEXT;
};
// arduino_softserial 
if (Blockly.Blocks.soft_init) Blockly.Blocks.soft_init.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.soft_read) Blockly.Blocks.soft_read.getBlockType = function () {
	return Blockly.Types.TEXT;
};
if (Blockly.Blocks.soft_write) Blockly.Blocks.soft_write.getBlockType = function () {
	return Blockly.Types.NUMBER;
};
if (Blockly.Blocks.soft_available) Blockly.Blocks.soft_available.getBlockType = function () {
	return Blockly.Types.BOOLEAN;
};