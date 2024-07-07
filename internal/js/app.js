let PhxApp = {
    api(scope, params, failedCallback, successCallback) {
        var url = new URL("/api/webhook", window.location.origin);
        url.searchParams.append("scope", scope);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + window.userToken
            }
        })
            .then(response => response.json())
            .then(data => {
                if (successCallback != null) {
                    successCallback(data);
                }
            })
            .catch(error => {
             
                setTimeout(() => {
                    if (failedCallback != null) {
                        failedCallback();
                    }
                 
                }, 500);
            });
    },
   
  


}

module.exports = PhxApp;