// controle
Blockly.Java.controls_if = function (a) {
    var b = 0, c = "";
    do {
        var d = Blockly.Java.valueToCode(a, "IF" + b, Blockly.Java.ORDER_NONE);
        var e = Blockly.Java.statementToCode(a, "DO" + b);
        c += (0 == b ? "if " : "else if ") + "(" + d + ") {\n" + e + "}\n"; ++b
    } while (a.getInput("IF" + b));
    a.getInput("ELSE") && (e = Blockly.Java.statementToCode(a, "ELSE"), c += "else {\n" + e + "}\n");
    return c
};
Blockly.Java.logic_negate = function (a) {
    return ["!" + (Blockly.Java.valueToCode(a, "BOOL", Blockly.Java.ORDER_ATOMIC)), Blockly.Java.ORDER_ATOMIC]
};
Blockly.Java.logic_null = function (a) {
    return ["null", Blockly.Java.ORDER_ATOMIC]
};
Blockly.Java.controls_whileUntil = function (a) {
    var b = "UNTIL" == a.getFieldValue("MODE"), c = Blockly.Java.valueToCode(a, "BOOL", Blockly.Java.ORDER_NONE), d = Blockly.Java.statementToCode(a, "DO");
    if (b) c = "!(" + c + ")";
    return "while (" + c + ") {\n" + d + "}\n";
};
Blockly.Java.math_number = function (a) {
    var b = parseFloat(a.getFieldValue("NUM"));
    return [b, Blockly.Java.ORDER_ATOMIC]
};
Blockly.Java.math_arithmetic = function (a) {
    var b = {
        ADD: [" + ", Blockly.Java.ORDER_ATOMIC],
        MINUS: [" - ", Blockly.Java.ORDER_ATOMIC],
        MULTIPLY: [" * ", Blockly.Java.ORDER_ATOMIC],
        DIVIDE: [" / ", Blockly.Java.ORDER_ATOMIC],
        POWER: ["Math.pow", Blockly.Java.ORDER_ATOMIC]
    }[a.getFieldValue("OP")],
        c = b[0]; b = b[1];
    var d = Blockly.Java.valueToCode(a, "A", b);
    var e = Blockly.Java.valueToCode(a, "B", b);
    if (a.getFieldValue("OP") == "POWER") return ["Math.pow(" + d + ", " + e + ")", b];
    return [d + c + e, b]
};
Blockly.Java.logic_compare = function (a) {
    var b = { EQ: "==", NEQ: "!=", LT: "<", LTE: "<=", GT: ">", GTE: ">=" }[a.getFieldValue("OP")], d = Blockly.Java.valueToCode(a, "A", Blockly.Java.ORDER_ATOMIC);
    var e = Blockly.Java.valueToCode(a, "B", Blockly.Java.ORDER_ATOMIC);
    return [d + " " + b + " " + e, Blockly.Java.ORDER_ATOMIC]
};
Blockly.Java.text = function (a) {
    return [Blockly.Java.quote_(a.getFieldValue("TEXT")), Blockly.Java.ORDER_ATOMIC]
};
Blockly.Java.variables_get = function (a) {
    return [Blockly.Java.variableDB_.getName(a.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE), Blockly.Java.ORDER_ATOMIC]
};
Blockly.Java.variables_set = function (a) {
    var b = Blockly.Java.valueToCode(a, "VALUE", Blockly.Java.ORDER_NONE);
    return Blockly.Java.variableDB_.getName(a.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE) + " = " + b + ";\n"
};
Blockly.Java["base_setup_loop"] = function (block) {
    var setup_branch = Blockly.Java.statementToCode(block, "DO");
    var loop_branch = Blockly.Java.statementToCode(block, "LOOP");
    var code = "";
    if (setup_branch) {
        Blockly.Java.setups_["userSetup"] = setup_branch;
    }
    code += "while (true) {\n" + (loop_branch || "  // loop\n") + "}\n";
    return code;
};
Blockly.Java["base_delay"] = function (block) {
    var _u = block.getFieldValue("unite");
    var delay_time = Blockly.Java.valueToCode(block, "DELAY_TIME", Blockly.Java.ORDER_ATOMIC);
    var ms = delay_time;
    if (_u == "s") ms = "(" + delay_time + " * 1000)";
    if (_u == "u") ms = "(" + delay_time + " / 1000)";
    return "try { Thread.sleep((long)" + ms + "); } catch (Exception e) {}\n";
};
