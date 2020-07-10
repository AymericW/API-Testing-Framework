#!groovy
@Library('CIPaaS') import com.bnpparibasfortis.CIPaaServices

node ('Customers_slave2'){

    // Init CIPaaS Services
    // env.APPLICATION_CODE = "TF01"

    // env.APPLICATION_COMPONENT = "TF01-pr90"

    // env.APPLICATION_COMPONENT_TYPE = "Javascript"

    // def cipaas = new CIPaaServices(this)
 
    // def cipaasDockerRegistryName = cipaas.getCIPaaSDockerRegistryName()
    // def centralNPMPublicGroupURL = cipaas.getCentralNPMPublicGroupURL()
    // def localNPMHostedRepositoryURL = cipaas.getLocalNPMHostedRepositoryURL()
    // println "cipaasDockerRegistryName is ${cipaasDockerRegistryName}"
    // println "centralNPMPublicGroupURL is ${centralNPMPublicGroupURL}"
    // println "localNPMHostedRepositoryURL is ${localNPMHostedRepositoryURL}"


    // // Node image used in this pipeline
    // def nodeImageName = "${cipaasDockerRegistryName}/cip/node:8.9.4-R1.7"
    // def nodeImage = docker.image("${nodeImageName}")

    stage ('Start pipeline') {println "Start pipeline"}

    stage ('Checkout') {checkout scm}

        stage ('Install NPM local dependencies') {
            //steps.sh "npm config set registry ${centralNPMPublicGroupURL}"
            steps.sh "npm install"
        }
        stage ('Run the script(contact_management.feature)') {
            steps.sh "sh ./scripts/run.sh 'countries'"
        }

        stage ('Generate HTML report') {
            cucumber buildStatus: 'UNSTABLE', fileIncludePattern: 'reports/result.json', sortingMethod: 'ALPHABETICAL'
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




// #!groovy
// @Library('CIPaaS') import com.bnpparibasfortis.CIPaaServices

// node ('master'){

//     // Init CIPaaS Services
//     env.APPLICATION_CODE = "TF01"

//     env.APPLICATION_COMPONENT = "TF01-pr90"

//     env.APPLICATION_COMPONENT_TYPE = "Javascript"

//     def cipaas = new CIPaaServices(this)
 
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
//             steps.sh "npm install custom-cucumber-report-generator"
//         }
//         stage ('Run the script(ocpl_prospect.feature)') {
//             steps.sh "sh ./scripts/run.sh 'ocpl_prospect'"
//             steps.sh "./node_modules/.bin/custom-cucumber-report-generator -f ocpl_prospect.json"
//         }
//         stage ('Upload the Report') {
//             steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "Prospect API" "API" "Full Test" "API" "QA+1" "ocpl_prospect.json" "http://10.213.184.184:8888/"'
//         }
//         stage('Generate HTML report') {
//             cucumber buildStatus: 'UNSTABLE'
//             fileIncludePattern: '**/*.json'
//         }
//     }
//     stage ('End pipeline') {println "End pipeline"}
// }
