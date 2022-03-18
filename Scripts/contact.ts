namespace core 
{
    export class Contact
    {

        // Private instance members
        private m_fullName: string;
        private m_contactNumber: string;
        private m_emailAddress: string;

        // Getters/Setters
        get FullName(): string
        {
            return this.m_fullName;
        }
    
        set FullName(fullName: string)
        {
            this.m_fullName = fullName;
        }
    
        get ContactNumber(): string
        {
            return this.m_contactNumber;
        }
    
        set ContactNumber(contactNumber: string)
        {
            this.m_contactNumber = contactNumber;
        }
    
        get EmailAddress(): string
        {
            return this.m_emailAddress;
        }
    
        set EmailAddress(emailAddress: string)
        {
            this.m_emailAddress = emailAddress;
        }
    
        // Constructor
        constructor(fullName: string = "", contactNumber: string = "", emailAddress: string = "")
        {
            this.m_fullName = fullName;
            this.m_contactNumber = contactNumber;
            this.m_emailAddress = emailAddress;
        }
    
        // Public Utility Methods
    
        serialize(): string
        {
            if(this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "")
            {
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            }
            console.error("One or more properties of the Contact Object are missing or invalid");
            return "";
        }
    
        deserialize(data: string): void // assume that the data is in a comma-separated format (string array of properties)
        {
            let propertyArray: string[] = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }
    
        // Override toString method
        toString(): string
        {
            return `Full Name: ${this.FullName} \nContact Number: ${this.ContactNumber} \nEmail Address: ${this.EmailAddress}`;
        }
    }
}
