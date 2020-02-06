Feature=$1
kinit -k -t g27663.keytab G27663@INT.SYS.SHARED.FORTIS
unset HTTP_PROXY
npm config set registry http://cipcentral-prod.be.net.intra/nexus/repository/BNPPF_NPM/
npm install
export HTTP_PROXY="http://nwbcproxy.res.sys.shared.fortis:8080"
npm start features/$Feature.feature -- --format json:$Feature.json || true


# unset HTTP_PROXY  
# npm config set registry http://cipcentral-prod.be.net.intra/nexus/repository/BNPPF_NPM/  
# npm install  
# export HTTP_PROXY="http://nwbcproxy.res.sys.shared.fortis:8080"  
# node_modules/cucumber/bin/cucumber.js -f json:cucumberQA.json || true