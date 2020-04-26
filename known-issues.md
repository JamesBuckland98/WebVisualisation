# Known Issues

- The API has a rather egregious memory leak. A lot of formatting was done while adding Jaeger, so it could be either of those things. However, I am not a Java dev, I do not know Java, so I couldn't begin to track down the problem.

- A bug was found with our security implementation. A user was able to go to a production site, and without being prompted, was logged into a user account. More importantly, this was a user account they had never logged into before, so it was not a caching issue, or the browser storing state. This was the user being served the wrong content.
