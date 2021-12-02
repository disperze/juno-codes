import React from "react";

interface Props {
    readonly value: string;
    readonly title: string;
    readonly iconName: string;
    readonly color: string;
}




export default function CardInfo({ value, title, iconName, color }: Props): JSX.Element {

    const [cardClass, setCardClass] = React.useState<string>();
    const [icon, setIcon] = React.useState(`fas fa-${iconName} fa-2x text-gray-300`);
    const [titleClass, setTitleClass] = React.useState(`text-xs font-weight-bold text-${color} text-uppercase mb-1`);

    React.useEffect(() => {
        setCardClass(`card border-left-${color} shadow h-100 py-2`);
        setIcon(`fas fa-${iconName} fa-2x text-gray-300`);
        setTitleClass(`text-xs font-weight-bold text-${color} text-uppercase mb-1`)
    }, [setCardClass, setIcon, setTitleClass]);


    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className={cardClass}>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className={titleClass}>{title}</div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{value}</div>
                        </div>
                        <div className="col-auto">
                            <i className={icon}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}