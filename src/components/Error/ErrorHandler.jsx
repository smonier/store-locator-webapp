import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

export const ErrorHandler = ({item, errors}) => {
    const {t} = useTranslation();
    if (errors) {
        return (
            <div>
                <h1>{t('error.validation.title')}</h1>
                <p>{t('error.validation.msg')} <b>{item}</b></p>
                <ul>
                    {errors.map(error => {
                        const additionalProperty = error.params?.additionalProperty;
                        return (
                            <li key={`${error.keyword}_${additionalProperty}`}>
                                {error.message}<b>{additionalProperty ? `: ${additionalProperty}` : ''}</b>
                            </li>
);
})}
                </ul>
            </div>
        );
    }

    return (
        <div>
            <h1>{t('error.default.title')}</h1>
            <p>{t('error.default.msg')}: <b>{item}</b></p>
        </div>
    );
};

ErrorHandler.propTypes = {
    item: PropTypes.string.isRequired,
    errors: PropTypes.array
};
