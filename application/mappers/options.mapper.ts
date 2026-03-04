import { OptionType } from "@/domain/entities/option.entity"
import { ProfileEntity } from "@/domain/entities/profile.entity"

export function mapProfilesToOptions(row: ProfileEntity): OptionType {
    return {
        value: row.id,
        label: row.email
    }
}