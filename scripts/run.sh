Feature=$1
token=$2
kinit -k -t G47594.keytab G47594@INT.SYS.SHARED.FORTIS
unset HTTP_PROXY
npm install
export HTTP_PROXY="http://nwbcproxy.res.sys.shared.fortis:8080"
node ./node_modules/cucumber/bin/cucumber-js features/$Feature.feature -f json:reports/result.json || true


