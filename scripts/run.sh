unset HTTP_PROXY  
npm config set registry http://cipcentral-prod.be.net.intra/nexus/repository/BNPPF_NPM/  
npm install  
export HTTP_PROXY="http://nwbcproxy.res.sys.shared.fortis:8080"  
export TARGET_ENV=QA+1  
node_modules/cucumber/bin/cucumber.js -f json:cucumber_report.json || true  