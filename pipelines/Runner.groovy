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
    def nodeImageName = "${cipaasDockerRegistryName}/cip/node:8.9.4-R1.0"
    def nodeImage = docker.image("${nodeImageName}")

    stage ('Start pipeline') {println "Start pipeline"}

    stage ('Checkout') {checkout scm}
    
    nodeImage.inside('-u root') {
        stage ('Install NPM local dependencies') {
            steps.sh "npm config set registry ${centralNPMPublicGroupURL}"
            steps.sh "npm install"
        }
        stage ('Run the script') {
            steps.sh "./scripts/run.sh"
        }
        
        stage ('Upload the Report') {
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "API Testing Consent" "CUSTOMERS" "1.0" "API" "cucumber.json" "http://wpdm0104.be.fortis.bank:8000/"'
        }
    }

    stage ('End pipeline') {println "End pipeline"}

}
