# tigris-cors-repro

I am having trouble uploading files from a browser to Tigris using a pre-signed URL. Tigris responds to the OPTIONS request with 403 Forbidden, and I see the following error in the developer console:

> Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

Steps to reproduce:

1. Create a new private Tigris bucket.
1. Edit the bucket settings to add a new CORS rule with the following options:
   - Origins: `*`
   - Allowed Methods: PUT, OPTIONS
1. Create a Tigris access key with Editor access to the new bucket.
1. Add the Tigris access key ID, secret access key, and bucket name to the index.js file.
1. Run `npm ci && node index.js`.
1. Visit http://localhost:3000/ and open the developer console.
