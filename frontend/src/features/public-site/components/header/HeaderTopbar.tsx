import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { COMPANY } from "../../data/company";

export function HeaderTopbar() {
    return (
        <div className="ix-topbar">
            <div className="public-container">
                <span>Metrología, consultoría y equipamiento</span>
                <div>
                    <a href={COMPANY.salesEmailHref}>
                        <CorporateIcon name="mail" /> {COMPANY.salesEmail}
                    </a>
                    <a href={COMPANY.primaryPhoneHref}>
                        <CorporateIcon name="phone" /> {COMPANY.primaryPhone}
                    </a>
                </div>
            </div>
        </div>
    );
}
