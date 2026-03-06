'use strict';

goog.provide('Blockly.Java');
goog.require('Blockly.Generator');

Blockly.Java = new Blockly.Generator("Java");
Blockly.Java.addReservedWords("abstract,assert,boolean,break,byte,case,catch,char,class,const,continue,default,do,double,else,enum,extends,final,finally,float,for,goto,if,implements,import,instanceof,int,interface,long,native,new,package,private,protected,public,return,short,static,strictfp,super,switch,synchronized,this,throw,throws,transient,try,void,volatile,while");

Blockly.Java.ORDER_ATOMIC = 0;
Blockly.Java.ORDER_NONE = 99;

Blockly.Java.init = function (a) {
    Blockly.Java.imports_ = Object.create(null);
    Blockly.Java.definitions_ = Object.create(null);
    Blockly.Java.setups_ = Object.create(null);
    if (Blockly.Java.variableDB_) {
        Blockly.Java.variableDB_.reset();
    } else {
        Blockly.Java.variableDB_ = new Blockly.Names(Blockly.Java.RESERVED_WORDS_);
    }
    if (Blockly.Java.variableDB_.setVariableMap) {
        Blockly.Java.variableDB_.setVariableMap(a.getVariableMap());
    } else {
        Blockly.Java.variableDB_.variableMap_ = a.getVariableMap();
    }
};

Blockly.Java.finish = function (a) {
    var imports = [], definitions = [], setups = [];
    for (var name in Blockly.Java.imports_) {
        imports.push(Blockly.Java.imports_[name]);
    }
    for (var name in Blockly.Java.definitions_) {
        definitions.push(Blockly.Java.definitions_[name]);
    }
    for (var name in Blockly.Java.setups_) {
        setups.push(Blockly.Java.setups_[name]);
    }

    delete Blockly.Java.imports_;
    delete Blockly.Java.definitions_;
    delete Blockly.Java.setups_;

    var code = "public class Main {\n";
    if (definitions.length) {
        code += "  " + definitions.join("\n  ") + "\n\n";
    }
    code += "  public static void main(String[] args) {\n";
    if (setups.length) {
        code += "    " + setups.join("\n    ") + "\n";
    }
    code += "    " + a.replace(/\n/g, "\n    ") + "\n";
    code += "  }\n}";

    var header = "";
    if (imports.length) {
        header = imports.join("\n") + "\n\n";
    }

    return header + code;
};

Blockly.Java.scrubNakedValue = function (a) {
    return a + ";\n"
};

Blockly.Java.quote_ = function (a) {
    a = a.replace(/\\/g, "\\\\").replace(/\n/g, "\\\n").replace(/"/g, "\\\"");
    return "\"" + a + "\""
};

Blockly.Java.scrub_ = function (a, b) {
    var c = "";
    if (!a.outputConnection || !a.outputConnection.targetConnection) {
        var d = a.getCommentText();
        d && (c += Blockly.Java.prefixLines(d, "// ") + "\n");
        for (var e = 0; e < a.inputList.length; e++)a.inputList[e].type == Blockly.INPUT_VALUE && (d = a.inputList[e].connection.targetBlock()) && (d = Blockly.Java.allNestedComments(d)) && (c += Blockly.Java.prefixLines(d, "// "))
    }
    var e = a.nextConnection && a.nextConnection.targetBlock();
    var nextCode = Blockly.Java.blockToCode(e);
    return c + b + nextCode;
};
