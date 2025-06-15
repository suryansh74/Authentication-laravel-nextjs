import AuthNavbar from "./AuthNavbar";
import { ModeToggle } from "./ModeToggle"


export default function Navbar() {
    return (
        <div className="flex justify-between max-w-11/12 mx-auto mt-8 items-center">
            {/* Static section */}
            <div>
                <p>LOGO</p>
            </div>

            {/* Dynamic client-side section */}
            <div className="flex space-x-4">

                <AuthNavbar />
                <ModeToggle />

            </div>
        </div>
    )
}
