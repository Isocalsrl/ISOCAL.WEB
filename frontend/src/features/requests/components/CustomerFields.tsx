export function CustomerFields() {
    return <div className="co-form-grid">
        <label>Nombre completo *<input name="name" required maxLength={120} autoComplete="name" placeholder="Tu nombre y apellidos" /></label>
        <label>Correo electrónico *<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="nombre@empresa.com" /></label>
        <label>Teléfono o WhatsApp *<input name="phone" type="tel" required maxLength={30} autoComplete="tel" placeholder="+51 999 999 999" /></label>
        <label>Empresa<input name="company" maxLength={160} autoComplete="organization" /></label>
        <label>RUC<input name="ruc" inputMode="numeric" pattern="[0-9]{11}" maxLength={11} /></label>
        <label>Ciudad o distrito<input name="location" maxLength={120} autoComplete="address-level2" /></label>
    </div>;
}
