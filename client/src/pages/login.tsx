import Textfield from "../components/Textfield";
import "../css/pages/login.css";

function Loginp() {
    return (
        <div className="login-page">
            <div className="name-app">Let's Talk</div>
            <div className="container-form">
                <div className="login-title"><h1>Login</h1></div>
                <form>
                    <div className="form-group">
                        <Textfield placeholder="Email"/>
                    </div>
                    <div className="form-group">
                        <Textfield placeholder="Password"/>
                    </div>
                    <button type="submit">Login</button>
                    </form>
            </div>
        </div>
    )
}
export default Loginp;