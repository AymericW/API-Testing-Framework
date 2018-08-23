#!groovy
@Library('CIPaaS') import com.bnpparibasfortis.CIPaaServices
node ('master'){
//node ('IOS'){
    // Init CIPaaS Services
    def cipaas = new CIPaaServices(docker,steps,env)
    def cipaasDockerRegistryName = cipaas.getCIPaaSDockerRegistryName()
    def centralNPMPublicGroupURL = cipaas.getCentralNPMPublicGroupURL()
    def localNPMHostedRepositoryURL = cipaas.getLocalNPMHostedRepositoryURL()
    println "cipaasDockerRegistryName is ${cipaasDockerRegistryName}"
    println "centralNPMPublicGroupURL is ${centralNPMPublicGroupURL}"
    println "localNPMHostedRepositoryURL is ${localNPMHostedRepositoryURL}"
    // Node image used in this pipeline 
    def nodeImageName = "${cipaasDockerRegistryName}/cip/node:8.9.4-R1.7"
    def nodeImage = docker.image("${nodeImageName}")
    stage ('Start pipeline') {println "Start pipeline"}
    stage ('Checkout') {checkout scm}
    
    nodeImage.inside('-u root') {
        stage ('Install NPM local dependencies') {
            steps.sh "npm config set registry ${centralNPMPublicGroupURL}"
            steps.sh "npm install"
        }
        stage ('Run the script(ocpl_prospect.feature)') {
            steps.sh "./scripts/run.sh 'ocpl_prospect'"
        }
        stage ('Run the script(ocpl_getProductList.feature)') {
            steps.sh "./scripts/run.sh 'ocpl_getProductList'"
        }
        stage ('Run the script(ocpl_countries.feature)') {
            steps.sh "./scripts/run.sh 'ocpl_countries'"
        }
        stage ('Upload the Report') {
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "postProspect (TEST)" "API" "Full Test" "API" "TEST" "ocpl_prospect.json" "http://wpdm0006.be.fortis.bank:8080/"'
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "getProductList (TEST)" "API" "Full Test" "API" "TEST" "ocpl_getProductList.json" "http://wpdm0006.be.fortis.bank:8080/"'
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "getCountries (QA+1)" "API" "Full Test" "API" "QA+1" "ocpl_countries.json" "http://wpdm0006.be.fortis.bank:8080/"'
        }
    }
    stage ('End pipeline') {println "End pipeline"}
}

// #!groovy
// @Library('CIPaaS') import com.bnpparibasfortis.CIPaaServices

// node ('master'){

//     // Init CIPaaS Services
//     def cipaas = new CIPaaServices(docker,steps,env)
//     def cipaasDockerRegistryName = cipaas.getCIPaaSDockerRegistryName()
//     def centralNPMPublicGroupURL = cipaas.getCentralNPMPublicGroupURL()
//     def localNPMHostedRepositoryURL = cipaas.getLocalNPMHostedRepositoryURL()
//     println "cipaasDockerRegistryName is ${cipaasDockerRegistryName}"
//     println "centralNPMPublicGroupURL is ${centralNPMPublicGroupURL}"
//     println "localNPMHostedRepositoryURL is ${localNPMHostedRepositoryURL}"


//     // Node image used in this pipeline 
//     def nodeImageName = "${cipaasDockerRegistryName}/cip/node:8.9.4-R1.7"
//     def nodeImage = docker.image("${nodeImageName}")

//     stage ('Start pipeline') {println "Start pipeline"}

//     stage ('Checkout') {checkout scm}
    
//     nodeImage.inside('-u root') {
//         stage ('Install NPM local dependencies') {
//             steps.sh "npm config set registry ${centralNPMPublicGroupURL}"
//             steps.sh "npm install"
//         }
//         stage ('Run the script') {
//             steps.sh "./scripts/run.sh"
//         }
        
//         stage ('Upload the Report') {
//             steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "Become a Retail Customer (QAP1)" "API" "CUSTOMERS" "1.0" "API" "cucumberQA.json" "http://wpdm0006:8080"'
//         }
//     }

//     stage ('End pipeline') {println "End pipeline"}

// }
