// (C) 2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import Overlay from "@gooddata/goodstrap/lib/core/Overlay";
import Button from "@gooddata/goodstrap/lib/Button/Button";

import { ISeparators } from "../../filters/MeasureValueFilter/separators";
import { IPositioning, SnapPoint } from "../../../typings/positioning";
import { positioningToAlignPoints } from "../../../helpers/utils";
import Preview from "./previewSection/Preview";
import FormatInput from "./FormatInput";
import DocumentationLink from "./DocumentationLink";
import { IFormatTemplate } from "../typings";

interface ICustomFormatDialogOwnProps {
    onApply: (formatString: string) => void;
    onCancel: () => void;
    formatString: string;
    documentationLink?: string;
    anchorEl?: string | EventTarget;
    positioning?: IPositioning[];
    separators?: ISeparators;
    locale?: string;
    templates?: ReadonlyArray<IFormatTemplate>;
}

interface ICustomFormatDialogState {
    format: string;
}

type ICustomFormatDialogProps = ICustomFormatDialogOwnProps & WrappedComponentProps;

export class CustomFormatDialog extends React.PureComponent<
    ICustomFormatDialogProps,
    ICustomFormatDialogState
> {
    public static defaultProps: Partial<ICustomFormatDialogProps> = {
        positioning: [
            { snapPoints: { parent: SnapPoint.CenterRight, child: SnapPoint.CenterLeft } },
            { snapPoints: { parent: SnapPoint.TopRight, child: SnapPoint.TopLeft } },
            { snapPoints: { parent: SnapPoint.BottomRight, child: SnapPoint.BottomLeft } },
        ],
    };

    public readonly state: Readonly<ICustomFormatDialogState> = {
        format: this.props.formatString || "",
    };

    public render() {
        const {
            anchorEl,
            positioning,
            onCancel,
            separators,
            templates,
            documentationLink,
            intl,
        } = this.props;
        const { format } = this.state;

        return (
            <Overlay
                closeOnParentScroll={true}
                closeOnMouseDrag={true}
                closeOnOutsideClick={true}
                alignTo={anchorEl}
                alignPoints={positioningToAlignPoints(positioning)}
                onClose={onCancel}
            >
                <div className="gd-dropdown overlay">
                    <div className="gd-measure-custom-format-dialog-body s-custom-format-dialog-body">
                        <div className="gd-measure-custom-format-dialog-header">
                            <span>{intl.formatMessage({ id: "measureNumberCustomFormatDialog.title" })}</span>
                        </div>
                        <div className="gd-measure-custom-format-dialog-content">
                            <FormatInput
                                format={format}
                                templates={templates}
                                separators={separators}
                                onFormatChange={this.onFormatChange}
                            />
                            {documentationLink && <DocumentationLink url={documentationLink} />}
                            <Preview format={format} separators={separators} />
                        </div>
                        <div className="gd-measure-custom-format-dialog-footer">
                            <Button
                                className="gd-button-secondary gd-button-small s-custom-format-dialog-cancel"
                                onClick={onCancel}
                                value={intl.formatMessage({ id: "cancel" })}
                            />
                            <Button
                                className="gd-button-action gd-button-small s-custom-format-dialog-apply"
                                onClick={this.onApply}
                                value={intl.formatMessage({ id: "apply" })}
                                disabled={this.isApplyButtonDisabled()}
                            />
                        </div>
                    </div>
                </div>
            </Overlay>
        );
    }

    private onApply = () => {
        this.props.onApply(this.state.format);
    };

    private isApplyButtonDisabled = () =>
        this.props.formatString === this.state.format || this.state.format === "";

    private onFormatChange = (format: string) => {
        this.setState({ format });
    };
}
