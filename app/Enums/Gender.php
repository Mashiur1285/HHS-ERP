<?php

namespace App\Enums;

enum Gender: string
{
    case MALE   = 'male';
    case FEMALE = 'female';
    case OTHER  = 'other';

    public function label(): string
    {
        return match($this) {
            Gender::MALE   => 'Male',
            Gender::FEMALE => 'Female',
            Gender::OTHER  => 'Others',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
