#!groovy
@Library('CIPaaS')
import com.bnpparibasfortis.CIPaaServices

node('Customers_slave2') {



    stage ('Start pipeline') {println "Start pipeline"}

    stage ('Checkout') {checkout scm}

    stage ('Install NPM local dependencies') {
        //steps.sh "npm config set registry ${centralNPMPublicGroupURL}"
        steps.sh "npm install"
    }
    stage ('Run the script(contact_management.feature)') {
        steps.sh "sh ./scripts/run.sh 'mifid_consent_wava'"
    }

    stage ('Generate HTML report') {
        cucumber buildStatus: 'UNSTABLE', fileIncludePattern: 'reports/result.json', sortingMethod: 'ALPHABETICAL'
    }

    stage ('End pipeline') {println "End pipeline"}
}

