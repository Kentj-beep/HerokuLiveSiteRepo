namespace core
{

    export class User
    {
        // Private instance members
        private m_displayName: string;
        private m_emailAddress: string;
        private m_username: string;  
        private m_password: string;


        // Getters/Setters
        public get DisplayName(): string {
            return this.m_displayName;
        }
        public set DisplayName(display_name: string) {
            this.m_displayName = display_name;
        }

        public get EmailAddress(): string {
            return this.m_emailAddress;
        }
        public set EmailAddress(email_address: string) {
            this.m_emailAddress = email_address;
        }

        public get Username(): string {
            return this.m_username;
        }
        public set Username(username: string) {
            this.m_username = username;
        }

        public get Password(): string {
            return this.m_password;
        }
        public set Password(password: string) {
            this.m_password = password;
        }


        // Constructor
        constructor(displayName: string = "", emailAddress: string = "", username: string = "", password: string = "")
        {
            this.m_displayName = displayName;
            this.m_emailAddress = emailAddress;
            this.m_username = username;
            this.m_password = password;
        }

        // Override methods
        toString(): string
        {
            return `Display Name : ${this.m_displayName}\n
            Email Address : ${this.m_emailAddress}\n
            Username : ${this.m_username}`;
        }

        // Utility methods

        //TODO: Fix return type
        toJSON()
        {
            return {
                "DisplayName": this.m_displayName,
                "EmailAddress": this.m_emailAddress,
                "Username": this.m_username
            }
        }

        //TODO: Fix data type
        fromJSON(data: any)
        {
            this.DisplayName = data.DisplayName;
            this.EmailAddress = data.EmailAddress;
            this.Username = data.Username;
            this.Password = data.Password;
        }

        serialize(): string | null
        {
            if(this.DisplayName !== "" && this.EmailAddress !== "" && this.Username !== "")
            {
                return `${this.DisplayName},${this.EmailAddress},${this.Username}`;
            }
            console.error("One or more properties of the User Object are missing or invalid");
            return null;
        }
    
        deserialize(data: string) // assume that the data is in a comma-separated format (string array of properties)
        {
            let propertyArray: string[] = data.split(",");
            this.DisplayName = propertyArray[0];
            this.EmailAddress = propertyArray[1];
            this.Username = propertyArray[2];
        }
    }
}