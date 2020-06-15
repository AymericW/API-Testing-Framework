$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$response = Invoke-WebRequest 'https://i-net800-qa.be.fortis.bank/EBPGJ01/BE_FORTIS_EBPG-pr01-war/rpc/ucr/CalculateOTP' -UseDefaultCredentials -Method Get -ContentType \'application/json\' -WebSession $session
$cookies = $session.Cookies.GetCookies('https://i-net800-qa.be.fortis.bank/EBPGJ01/BE_FORTIS_EBPG-pr01-war/rpc/ucr/CalculateOTP');
				      
$cookies | Out-File -FilePath cookies.txt

$PDSessioncookie = $cookies."Value"[1]    
    
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]";
                  $headers.Add("CSRF", '7J2vNthZH8qrMarOBTirxJZT9IT0aTeKEftAQvHT1Q0zzwK5V8tzobkb6vxoCch0ixLknFdv6qkmUrGrdLu0imsAuTamQBiwAEKBCPWX15oPhTI7Ag8w17OIPNul6phI');
                  
				  $content = '{"clientNumber": "1180546302", "callMode": "01", "previousWindowFlag": "0"}';  
                  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession;
                  $cookie = New-Object System.Net.Cookie;
                  $cookie.Name = "CSRF";
                  $cookie.Value = "7J2vNthZH8qrMarOBTirxJZT9IT0aTeKEftAQvHT1Q0zzwK5V8tzobkb6vxoCch0ixLknFdv6qkmUrGrdLu0imsAuTamQBiwAEKBCPWX15oPhTI7Ag8w17OIPNul6phI";
                  $cookie.Domain = 'i-net800-qa.be.fortis.bank';
                  $session.Cookies.Add($cookie);

                  $cookie2 = New-Object System.Net.Cookie;
                  $cookie2.Domain = 'i-net800-qa.be.fortis.bank';
                  $cookie2.Name = "PD-S-SESSION-ID";
                  $cookie2.Value =  $PDSessioncookie;
                  $session.Cookies.Add($cookie2);
                  
                  $response = Invoke-WebRequest 'https://i-net800-qa.be.fortis.bank/EBPGJ01/BE_FORTIS_EBPG-pr01-war/rpc/ucr/CalculateOTP\' -UseDefaultCredentials -Method Post -Body $content -ContentType 'application/json' -Headers $headers -WebSession $session;
                  $response.Content