class Status {
    getStatus(type, message, response) {
        let status;

        switch (type) {
            case 0, "error":
                status = {
                    type: "error",
                }
                break;
            case 1, "success":
                status = {
                    type: "success",
                }
                break;
            case 2, "warning":
                status = {
                    type: "warning",
                }
                break;
        }

        status.message = message;
        status.response = response;

        return status;

    }
}

module.exports = new Status();