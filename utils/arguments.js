/*
    Copyright (c) 2018 pent0

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

class ArgsLexer {
    constructor(argString) {
        this.tokens = new Array()
        this.pointee = -1;

        var i = 0;

        while (i < argString.length) {
            if (argString[i] != ' ') {
                var token = '';

                while (i < argString.length && argString[i] != ' ') {
                    token += argString[i++];
                }

                this.tokens.push({ string: token, end: i });
            } else {
                i++;
            }
        }
    }

    peek() {
        if (this.pointee + 1 >= this.tokens.length) {
            return null;
        }

        return this.tokens[this.pointee + 1];
    }

    next() {
        if (++this.pointee >= this.tokens.length) {
            return null;
        }

        return this.tokens[this.pointee];
    }

    TotalTokens() {
        return this.tokens.length;
    }

    GetToken(index) {
        if (index >= this.tokens.length) {
            return null;
        }

        return this.tokens[index];
    }
}

function GetArgsString(input, expectedStart) {
    if (input.length < expectedStart.length ||
        input.substring(0, expectedStart.length) != expectedStart) {
        return '';
    }

    return input.substring(expectedStart.length);
}

function IsCommandingMe(input, expectedStart) {
    return (input.length >= expectedStart.length &&
        input.substring(0, expectedStart.length) == expectedStart);
}

module.exports = {
    ArgsLexer,
    GetArgsString,
    IsCommandingMe
}