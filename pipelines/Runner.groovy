#!groovy
@Library('CIPaaS') import com.bnpparibasfortis.CIPaaServices

node ('master'){

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
            steps.sh "kinit -k -t g27663.keytab G27663@INT.SYS.SHARED.FORTIS"
            steps.sh "unset HTTP_PROXY"
            steps.sh "npm config set registry http://wpdm0006:8081/nexus/content/groups/npm-public-and-private/"
            steps.sh "npm install"
            steps.sh "export HTTP_PROXY='http://cipcentral-prod.be.net.intra/nexus/repository/BNPPF_NPM'"
            steps.sh "npm start features/ocpl_prospect.feature -f json:ocpl_prospect.json || true"
        }
        stage ('Run the script(ocpl_products.feature)') {
            steps.sh "npm start features/ocpl_products.feature -f json:ocpl_products.json || true"
        }
        stage ('Run the script(ocpl_countries.feature)') {
            steps.sh "npm start features/ocpl_countries.feature -f json:ocpl_countries.json || true"
        }
        stage ('Upload the Report') {
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "Prospect API" "API" "Full Test" "API" "QA+1" "ocpl_prospect.json" "http://wpdm0006.be.fortis.bank:8080/"'
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "Products API" "API" "Full Test" "API" "QA+1" "ocpl_products.json" "http://wpdm0006.be.fortis.bank:8080/"'
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "Countries API" "API" "Full Test" "API" "QA+1" "ocpl_countries.json" "http://wpdm0006.be.fortis.bank:8080/"'
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
