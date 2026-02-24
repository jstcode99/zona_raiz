// ============================================
// SCHEMAS DE FAVORITOS
// ============================================
import i18next from 'i18next';
import * as yup from 'yup';

export const favoriteSchema = yup.object({
  listing_id: yup
    .string()
    .uuid(i18next.t('validations.uuid', { attribute: 'listing_id' }))
    .required(i18next.t('validations.required', { attribute: 'listing_id' })),
});

export type FavoriteFormValues = yup.InferType<typeof favoriteSchema>