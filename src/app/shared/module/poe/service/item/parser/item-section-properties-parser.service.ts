import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemProperty, ItemSectionParserService, Section, ItemProperties } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionPropertiesParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const phrases = this.getPhrases(target);

        const propertiesSection = item.sections.find(section => phrases
            .findIndex(prop => section.content.indexOf(prop) !== -1) !== -1);
        if (!propertiesSection) {
            return null;
        }

        const props: ItemProperties = {};

        const lines = propertiesSection.lines;
        for (const line of lines) {
            props.weaponPhysicalDamage = this.parseProperty(line, phrases[0], props.weaponPhysicalDamage);
            props.weaponElementalDamage = this.parseProperty(line, phrases[1], props.weaponElementalDamage);
            props.weaponChaosDamage = this.parseProperty(line, phrases[2], props.weaponChaosDamage);
            props.weaponCriticalStrikeChance = this.parseProperty(line, phrases[3], props.weaponCriticalStrikeChance);
            props.weaponAttacksPerSecond = this.parseProperty(line, phrases[4], props.weaponAttacksPerSecond);
            props.weaponRange = this.parseProperty(line, phrases[5], props.weaponRange);
            props.shieldBlockChance = this.parseProperty(line, phrases[6], props.shieldBlockChance);
            props.armourArmour = this.parseProperty(line, phrases[7], props.armourArmour);
            props.armourEvasionRating = this.parseProperty(line, phrases[8], props.armourEvasionRating);
            props.armourEnergyShield = this.parseProperty(line, phrases[9], props.armourEnergyShield);
        }

        target.properties = props;
        return propertiesSection;
    }

    private parseProperty(line: string, phrase: string, prop: ItemProperty): ItemProperty {
        if (line.indexOf(phrase) !== 0) {
            return prop;
        }

        const augmented = line.indexOf(' (augmented)') !== -1;
        const text = line.replace(' (augmented)', '');

        const value = text.slice(phrase.length);

        const property: ItemProperty = {
            augmented,
            value
        };
        return property;
    }

    private getPhrases(target: Item): string[] {
        return [
            `${this.clientString.translate('ItemDisplayWeaponPhysicalDamage', target.language)}: `,
            `${this.clientString.translate('ItemDisplayWeaponElementalDamage', target.language)}: `,
            `${this.clientString.translate('ItemDisplayWeaponChaosDamage', target.language)}: `,
            `${this.clientString.translate('ItemDisplayWeaponCriticalStrikeChance', target.language)}: `,
            `${this.clientString.translate('ItemDisplayWeaponAttacksPerSecond', target.language)}: `,
            `${this.clientString.translate('ItemDisplayWeaponRange', target.language)}: `,
            `${this.clientString.translate('ItemDisplayShieldBlockChance', target.language)}: `,
            `${this.clientString.translate('ItemDisplayArmourArmour', target.language)}: `,
            `${this.clientString.translate('ItemDisplayArmourEvasionRating', target.language)}: `,
            `${this.clientString.translate('ItemDisplayArmourEnergyShield', target.language)}: `,
        ];
    }
}
