Feature=$1
token=$2
kinit -k -t G47594.keytab G47594@INT.SYS.SHARED.FORTIS
unset HTTP_PROXY
npm install
export HTTP_PROXY="http://nwbcproxy.res.sys.shared.fortis:8080"
npm start features/$Feature.feature  -f json:result.json || true

#npm start features/$Feature.feature  --plugin json -o result.json || true




# unset HTTP_PROXY  
# npm config set registry http://cipcentral-prod.be.net.intra/nexus/repository/BNPPF_NPM/  
# npm install  
# export HTTP_PROXY="http://nwbcproxy.res.sys.shared.fortis:8080"  
# ./node_modules/cucumber/bin/cucumber.js -f json:ocpl_prospect.json || true

#npm start features/ocpl_prospect.feature -f json:ocpl_prospect.json || true
