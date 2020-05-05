const rdl = require("readline");

class LoadingBar {
    constructor(size) {
        this.size = size;
        this.cursor = 0;
    }

    init() {
        process.stdout.write("\n");
        process.stdout.write("\x1B[?25l");
        process.stdout.write("[");
        for (let i = 0; i < this.size; i++) {
            process.stdout.write("\u2022");
        }
        process.stdout.write("]");
        this.cursor = 1;
        rdl.cursorTo(process.stdout, this.cursor);
    }

    update(processed, total) {
        let entire = 100;
        let onePercentOfSize = this.size / entire;
        let toInt = 100;
        let percent = (processed / total) * toInt;
        let percentOfSize = percent * onePercentOfSize;

        for (let i = this.cursor; i <= percentOfSize; i++) {
            process.stdout.write("\u2588");
            this.cursor++;
        }

        if (processed === total) {
            process.stdout.write("] ");
            process.stdout.write("\x1B[?25h");
        }
    }
}

module.exports = LoadingBar;
