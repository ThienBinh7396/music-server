const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const Status = require('./status');

const dayInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthInYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function formatNumber(num) {
    return num > 9 ? num : `0${num}`;
}

const Helper = {
    dayInWeek: dayInWeek,
    monthInYear: monthInYear,
    formatNumber: formatNumber,
    formatDate: function(str, type) {
        str = Number(`${str}`) || str;

        console.log(str);
        let date = new Date(str);

        let d = date.getDate();
        let month = date.getMonth() + 1;
        let y = date.getFullYear();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        let f = "";
        let full = `${d}/${month}/${y} ${h}:${formatNumber(m)}:${formatNumber(s)}`;

        let sqlTime = `${y}-${formatNumber(month)}-${formatNumber(d)} ${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
        switch (type) {

            case 1: //ex: 10:10pm 
                f = `${h > 12 ? h - 12 : h}:${formatNumber(m)}${h > 12 ? ' pm' : ' am'}`;
                break;

            case 2: //ex: Sat, Aug 29
                console.log(date.getDay());
                f = `${dayInWeek[date.getDay()]}, ${monthInYear[month - 1]} ${formatNumber(d)}`;
                break;

            case 3: //ex: 03/07/1996
                f = `${month}/${d}/${y}`;
                break;

            case 4: //ex: 12:00
                f = `${formatNumber(h)}:${formatNumber(m)}`;
                break;

            case 5: //ex: 10:10:10pm 
                f = `${h}:${formatNumber(m)}:${formatNumber(s)}`;
                break;
            case 6: //ex: Nov 20, 2019, 8:35 AM
                f = `${monthInYear[month - 1]} ${formatNumber(d)}, ${y}, ${h}:${m}${h > 12 ? 'PM' : 'AM'}`;
                break;
        }
        return {
            format: f,
            fullType: full,
            sqlTime: sqlTime
        }
    },
    formatDateByString: function(str, type) {

        let date = new Date(str);

        let d = date.getDate();
        let month = date.getMonth() + 1;
        let y = date.getFullYear();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        let f = "";
        let full = `${d}/${month}/${y} ${h}:${formatNumber(m)}:${formatNumber(s)}`;

        let sqlTime = `${y}-${formatNumber(month)}-${formatNumber(d)} ${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
        switch (type) {

            case 1: //ex: 10:10pm 
                f = `${h > 12 ? h - 12 : h}:${formatNumber(m)}${h > 12 ? ' pm' : ' am'}`;
                break;

            case 2: //ex: Sat, Aug 29
                console.log(date.getDay());
                f = `${dayInWeek[date.getDay()]}, ${monthInYear[month - 1]} ${formatNumber(d)}`;
                break;

            case 3: //ex: 03/07/1996
                f = `${month}/${d}/${y}`;
                break;

            case 4: //ex: 12:00
                f = `${formatNumber(h)}:${formatNumber(m)}`;
                break;

            case 5: //ex: 10:10:10pm 
                f = `${h}:${formatNumber(m)}:${formatNumber(s)}`;
                break;
            case 6: //ex: Nov 20, 2019, 8:35 AM
                f = `${monthInYear[month - 1]} ${formatNumber(d)}, ${y}, ${h}:${m}${h > 12 ? 'PM' : 'AM'}`;
                break;
        }
        return {
            format: f,
            fullType: full,
            sqlTime: sqlTime
        }
    },
    deleteAccent(str) {
        str = str.trim();

        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/\s+/g, "-");
        str = str.replace(/[^A-Za-z0-9\-]/gim, '');
        return str;
    },
    escapeText(str) {
        let htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };

        let htmlEscaper = /[&<>"'\/]/g;

        console.log(str);
        console.log("replace");

        str = str.replace(`<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`, '');
        console.log(str);

        str = str.replace(htmlEscaper, function(match) {
            return htmlEscapes[match];
        });

        str = str.replace(/\n/gim, '<br>');

        return str;
    },
    encryptBase64(str) {
        const encryptedWord = CryptoJS.enc.Utf8.parse(str); // encryptedWord Array object
        const encrypted = CryptoJS.enc.Base64.stringify(encryptedWord); // string: 'NzUzMjI1NDE='
        return encrypted;
    },

    decryptBase64(encrypted) {
        const encryptedWord = CryptoJS.enc.Base64.parse(encrypted); // encryptedWord via Base64.parse()
        const decrypted = CryptoJS.enc.Utf8.stringify(encryptedWord); // decrypted encryptedWord via Utf8.stringify() '75322541'
        return decrypted;
    },

    hashPassword(password) {

        return CryptoJS.HmacSHA1(password, process.env.SECRET_KEY).toString();
    },

    comparePassword(hashPassword, password) {
        let encodePassword = CryptoJS.HmacSHA1(password, process.env.SECRET_KEY).toString();

        return encodePassword == hashPassword;
    },

    generateTokenById(id, type, email, thumbnail, name) {

        const token = jwt.sign({
                userId: id,
                type: type,
                name: name,
                email: email
            },
            process.env.SECRET_KEY, { expiresIn: '7d' }
        );
        return token;
    },
    checkPostProvidedAttribute(req, res, attr) {
        let obj = {};

        for (let i = 0; i < attr.length; i++) {
            if (req.body[attr[i]] == null) {
                res.status(200).send(Status.getStatus('error', `${attr[i]} isn't provided`));

                return false;
            } else {
                obj[attr[i]] = req.body[attr[i]];
            }

        }
        return obj;
    }
}

module.exports = Helper;