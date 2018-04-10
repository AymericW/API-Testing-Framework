# Steps to be followed for setting up the Customers API testing Project #

1- git clone git@gitlab.res.sys.shared.fortis:EB-Customers/api-testing.git  
2- cd api-testing  
3- Download the dependencies and run the feature file  
	- unset HTTP_PROXY  
	- npm config set registry http://cipcentral-prod.be.net.intra/nexus/repository/BNPPF_NPM/  
	- npm install  
	- export HTTP_PROXY="http://nwbcproxy.res.sys.shared.fortis:8080"  
	- export TARGET_ENV=QA+1  
	- node_modules/cucumber/bin/cucumber.js -f json:cucumber_report.json || true  