import type {
    ServiceGroup,
} from "../../data/services";

interface ServiceDisclosureListProps {
    groups:
        readonly ServiceGroup[];

    defaultOpenCount?: number;
}

export function ServiceDisclosureList({
    groups,
    defaultOpenCount = 0,
}: ServiceDisclosureListProps) {
    return (
        <div className="services-disclosure-list">
            {groups.map(
                (
                    group,
                    index,
                ) => (
                    <details
                        key={
                            group.id
                        }
                        className="services-disclosure"
                        open={
                            index <
                            defaultOpenCount
                        }
                    >
                        <summary>
                            <span className="services-disclosure-number">
                                {String(
                                    index +
                                        1,
                                ).padStart(
                                    2,
                                    "0",
                                )}
                            </span>

                            <span className="services-disclosure-title">
                                {
                                    group.title
                                }
                            </span>

                            <span
                                className="services-disclosure-toggle"
                                aria-hidden="true"
                            />
                        </summary>

                        <div className="services-disclosure-content">
                            <ul>
                                {group.items.map(
                                    (
                                        item,
                                    ) => (
                                        <li
                                            key={
                                                item
                                            }
                                        >
                                            {
                                                item
                                            }
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </details>
                ),
            )}
        </div>
    );
}