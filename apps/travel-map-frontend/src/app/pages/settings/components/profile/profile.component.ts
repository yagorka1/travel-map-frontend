import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarComponent, InputComponent, LanguageEnum } from '@app/core';
import { SelectComponent, SelectOption } from '@app/core/components/select/select.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as ProfileActions from '../../../../core/store/profile/profile.actions';
import { selectProfile } from '../../../../core/store/profile/profile.selectors';
import { ProfileInterface, UpdateProfileDto } from '../../../../core/interfaces/profile.interface';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    SelectComponent,
    TranslateModule,
    AvatarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private translateService = inject(TranslateService);

  public profileForm!: FormGroup;

  public currentProfile: ProfileInterface | null = null;
  public selectedFile: File | null = null;

  public newAvatar!: string;

  public languages: SelectOption[] = [
    { value: LanguageEnum.EN, label: 'English' },
    { value: LanguageEnum.RU, label: 'Русский' },
    { value: LanguageEnum.BE, label: 'Беларуская' },
  ];

  public ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      language: [null, [Validators.required]],
    });

    this.store
      .select(selectProfile)
      .pipe(untilDestroyed(this))
      .subscribe((profile: ProfileInterface | null) => {
        this.currentProfile = profile;

        if (profile) {
          this.profileForm.patchValue({
            name: profile.name,
            language: profile.language,
          });
        }
      });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.newAvatar = URL.createObjectURL(input.files[0]);
    }
  }

  public onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const updateData: Partial<UpdateProfileDto> = {
        ...formValue,
      };

      if (this.selectedFile) {
        updateData.avatarUrl = this.selectedFile;
      }

      this.store.dispatch(ProfileActions.updateProfile({ profile: updateData }));
      this.selectedFile = null;
    }
  }
}
