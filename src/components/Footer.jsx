const Footer = () => {
    return (
        <footer className="bg-main text-main mt-auto py-1">
            <div className="container text-center">
                <p className="mb-1">
                    © {new Date().getFullYear()} Sistema de Condominios
                </p>
            </div>
        </footer>
    );
};

export default Footer;