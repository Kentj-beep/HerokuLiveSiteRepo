namespace core
{

    export class Router
    {
        private m_activeLink: string;
        private m_linkData: string;
        private m_routingTable: string[];

        // Public properties (getters/setters)
        get ActiveLink(): string
        {
            return this.m_activeLink;
        }

        set ActiveLink(link: string)
        {
            this.m_activeLink = link;
        }

        get LinkData(): string
        {
            return this.m_linkData;
        }

        set LinkData(link: string)
        {
            this.m_linkData = link;
        }

        // Constructor
        /**
         * Creates an instance of Router.
         * @constructor
         * @memberof Router
         */
        constructor()
        {
            this.m_activeLink = "";
            this.m_linkData = "";
            this.m_routingTable = []; // Creates an empty array
        }

        // Public methods

        /**
         * Adds a new route to the Routing table
         * @param {string} route
         * @memberof Router 
         */
        Add(route: string): void
        {
            this.m_routingTable.push(route);
        }

        /**
         * This replaces the current routing table with a new one
         * Routes should begin with '/' character
         * 
         * @param {string[]} routingTable
         * @memberof Router 
         */
        AddTable(routingTable : string[]): void
        {
            this.m_routingTable = routingTable;
        }

        /**
         * Finds the index of the route in the routing table,
         * otherwise it returns -1 for no route found
         *
         * @param {string} route
         * @returns {int} 
         * @memberof Router
         */
        Find(route: string): number
        {
            return this.m_routingTable.indexOf(route);
        }

        /**
         * Removes a route from the Routing Table
         * Returns true if a route was successfully removed,
         * otherwise returns false.
         *
         * @param {string} route
         * @returns {boolean} 
         * @memberof Router
         */
        Remove(route: string): boolean
        {
            if(this.Find(route) > -1)
            {
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }

        // Overridden methods

        /**
         * Returns the entire routing table as a string,
         * overriding the default toString method
         * 
         * @override
         * @return {string} 
         * @memberof Router
         */
        toString(): string
        {
            return this.m_routingTable.toString();
        }

    }
}

let router: core.Router = new core.Router();
router.AddTable([
    "/",
    "/home",
    "/about",
    "/projects",
    "/services",
    "/contact",
    "/contact-list",
    "/register",
    "/login",
    "/edit",
]);

let route: string = location.pathname; // Alias for location.pathname

if(router.Find(route) > -1)
{
    router.ActiveLink = (route == "/") ? "home" : route.substring(1);
}
else
{
    router.ActiveLink = "404"; // file not found
}