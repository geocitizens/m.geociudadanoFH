var url = 'http://ec2-107-22-58-53.compute-1.amazonaws.com:8080/GeoCitizen/';
var socialMediaID = null;

function Register()
{
    var firstname = document.getElementsByName('FirstName')[0].value;
    var lastname = document.getElementsByName('LastName')[0].value;
    var email = document.getElementsByName('EMail')[0].value;
    var password = document.getElementsByName('Password')[0].value;
    var year = document.getElementsByName('YearOfBirth')[0].value;
    var country = document.getElementsByName('Country')[0].value;
    var city = document.getElementsByName('City')[0].value;
    var neighborhood = document.getElementsByName('Neighborhood')[0].value;
    
    
    $.post( url+'GeoAccount', 
                    {
                        option: "registerMobil", 
                        email: email,
                        password: password,
                        name: firstname,
                        lastName: lastname,
                        country: country,
                        city: city,
                        SocialMediaID: socialMediaID,
                        neighborhood: neighborhood   
                    }
           )
}