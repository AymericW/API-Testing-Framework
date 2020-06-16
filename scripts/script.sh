#!/bin/bash
#get cookie.txt
curl -vk --negotiate --user : --cookie-jar cookies.txt --location https://i-net800-qa.be.fortis.bank/EBPGJ01
#get ucr
response= $(curl -L --cookie cookies.txt --negotiate --user : -vk -H 'CSRF: 7J2vNthZH8qrMarOBTirxJZT9IT0aTeKEftAQvHT1Q0zzwK5V8tzobkb6vxoCch0ixLknFdv6qkmUrGrdLu0imsAuTamQBiwAEKBCPWX15oPhTI7Ag8w17OIPNul6phI' -H 'Cookie: CSRF=7J2vNthZH8qrMarOBTirxJZT9IT0aTeKEftAQvHT1Q0zzwK5V8tzobkb6vxoCch0ixLknFdv6qkmUrGrdLu0imsAuTamQBiwAEKBCPWX15oPhTI7Ag8w17OIPNul6phI' -H "Content-type: application/json" -d '{"clientNumber":"1180546302","callMode":"01","previousWindowFlag":"0"}' 'https://i-net800-qa.be.fortis.bank/EBPGJ01/BE_FORTIS_EBPG-pr01-war/rpc/ucr/CalculateOTP')

echo $response